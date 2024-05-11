import { ref, computed } from 'vue'
import type { IRegistration, ITimeRange } from '@/interfaces'
import {
  extractWithDescription,
  checkForOverlap,
  saveToStorage,
  loadFromStorage,
  toRawDeep,
  findGaps,
  formatTime
} from '@/helpers'

import { defineStore } from 'pinia'
import { useToast } from 'vue-toast-notification'

export const useRegistrationStore = defineStore('registrationStore', () => {

  const formattedRegistrations = ref<Map<string, IRegistration>>(new Map())

  const registrationsArray = computed(() => {
    const array = Array.from(formattedRegistrations.value.values());
    // Sort registrationsArray based on the start time of the first time range in each registration
    array.sort((a, b) => {

      a.timeRanges.sort((aa, bb) => aa.startTime - bb.startTime); // Sort time ranges

      return a.timeRanges[0].startTime - b.timeRanges[0].startTime // Show earliest first
    });

    return array;

  });

  function formatWithoutSaving(registrationsText: string | undefined) {
    const tempDataString = loadFromStorage();

    formatRegistrationsCallback(registrationsText);
    const registrations = structuredClone(toRawDeep(registrationsArray.value));

    formatRegistrationsCallback(tempDataString);
    return registrations;

  }
  // Function to clear previous formatted registrations, process input, and handle errors
  function formatRegistrationsCallback(registrationsText: string | undefined) {

    if (registrationsText == undefined || registrationsText == "") {
      return;

    }

    // Clear previous formatted registrations and errors
    formattedRegistrations.value.clear()

    // Split input text into an array of strings based on new lines
    const registrations = registrationsText.split(/\r?\n/)

    // Format registrations and handle errors
    formatRegistrations(registrations)

    // Remove duplicate errors
    saveToStorage(registrationsText)
  }

  // Function to format registrations from an array of input strings
  function formatRegistrations(input: Array<string>) {
    for (let inputString of input) {
      // Trim leading and trailing whitespaces
      inputString = inputString.trim()

      // Skip empty lines
      if (inputString === '') {
        continue
      }

      // Determine whether the input string contains a description and parse accordingly
      const extractResult = extractWithDescription(inputString)

      // If the result is a string, it is an error message, add it to errors and return
      if (typeof extractResult === 'string') {
        const $toast = useToast()
        $toast.clear()
        $toast.error(`failed to extract time registrations: ${extractResult}`)
        return
      }

      // Set or add the registration to the formatted registrations
      updateOrAddRegistration(extractResult as IRegistration)

    }

    // Check for overlap warnings among registrations
    const registrationsArray = Array.from(formattedRegistrations.value.values());
    const overlaps = checkForOverlap(registrationsArray)

    overlaps.forEach((overlap) => {
      const registrationA = registrationsArray.filter((registration => registration.letter === overlap.registrationA))[0];
      const registrationB = registrationsArray.filter((registration => registration.letter === overlap.registrationB))[0];

      const startA = formatTime(overlap.timeRangeA.startTime);
      const endA = formatTime(overlap.timeRangeA.endTime);
      const startB = formatTime(overlap.timeRangeB.startTime);
      const endB = formatTime(overlap.timeRangeB.endTime);


      // if registration A and B are the same
      if (overlap.registrationA === overlap.registrationB) {
        const warning = `Overlap between ${startA}-${endA} and ${startB}-${endB}`;

        // Only show the overlap with lowest start time.
        // Otherwise, two warnings will be produced
        if (overlap.timeRangeA.startTime > overlap.timeRangeB.startTime) {
          return;
        }

        // Don't add same warning twice 
        if (registrationA.warnings.includes(warning) || registrationB.warnings.includes(warning)) {
          return;
        }

        registrationA.warnings.push(warning)
        setRegistration(registrationA);
        return;
      }

      registrationA.warnings.push(`Overlaps with '${overlap.registrationB}' between ${startA}-${endA} and ${startB}-${endB}`)
      registrationB.warnings.push(`Overlaps with '${overlap.registrationA}' between ${startA}-${endA} and ${startB}-${endB}`)

      setRegistration(registrationA);
      setRegistration(registrationB);
    })


    // Add any gaps 
    const gaps = findGaps(registrationsArray);

    let gapKey: string = "";
    gaps.forEach((gap: ITimeRange) => {

      gapKey += "_";
      setRegistration({
        letter: gapKey,
        clicked: false,
        description: `Gap between ${gap.startTime} - ${gap.endTime}`,
        errors: [],
        showAsWarning: true,
        timeRanges: [gap],
        warnings: []
      })

    })
  }

  // Function to set or add a registration to the formatted registrations
  function updateOrAddRegistration(input: IRegistration,) {
    const timeRanges: ITimeRange[] = [...input.timeRanges]
    let description = input.description ?? ''
    let clicked: boolean = input.clicked ?? false
    const registrationWarnings: string[] = []
    const registrationErrors: string[] = timeRanges.map((timeRange) => timeRange.parseError);


    if (formattedRegistrations.value.has(input.letter)) {
      const oldRegistration: IRegistration = formattedRegistrations.value.get(
        input.letter
      ) as IRegistration

      // Not really needed, but static code analysis kept complaining
      if (!oldRegistration) {
        console.error('Something went wrong finding this registration:', input)
        return
      }

      // If the old registration has a description, and the new registration also has a description, add an error
      if (!!oldRegistration.description && !!input.description) {
        registrationWarnings.push(`ID '${input.letter}' has multiple descriptions`)
      }

      description = oldRegistration.description || input.description
      clicked = oldRegistration.clicked || input.clicked

      // Add old registration's time ranges to the new registration
      timeRanges.push(...oldRegistration.timeRanges)
    }

    // Set the registration in the formatted registrations map
    setRegistration({
      letter: input.letter,
      timeRanges: timeRanges,
      description: description,
      clicked: clicked,
      warnings: registrationWarnings,
      errors: registrationErrors,
    } as IRegistration)
  }

  function setRegistration(registration: IRegistration) {
    formattedRegistrations.value.set(registration.letter, registration);
  }

  return { formattedRegistrations, registrationsArray, formatWithoutSaving, formatRegistrationsCallback, formatRegistrations, updateOrAddRegistration }
})
