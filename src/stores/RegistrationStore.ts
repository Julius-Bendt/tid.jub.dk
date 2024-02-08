import { ref, computed } from 'vue'
import type { IRegistration, ITimeRange } from '@/interfaces'
import {
  extractWithDescription,
  checkForOverlap,
  saveToStorage,
  loadFromStorage,
} from '@/helpers'

import { defineStore } from 'pinia'

export const useRegistrationStore = defineStore('registrationStore', () => {

  const formattedRegistrations = ref<Map<string, IRegistration>>(new Map())
  const errors = ref<string[]>([])

  const registrationsArray = computed(() => Array.from(formattedRegistrations.value.values()))

  function formatWithoutSaving(registrationsText: string | undefined) {
    const tempDataString = loadFromStorage();

    formatRegistrationsCallback(registrationsText);
    const registrations = JSON.parse(JSON.stringify(registrationsArray.value));

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
    errors.value = []

    // Split input text into an array of strings based on new lines
    const registrations = registrationsText.split(/\r?\n/)

    // Format registrations and handle errors
    formatRegistrations(registrations)

    // Remove duplicate errors
    errors.value = errors.value.filter((error, index, self) => self.indexOf(error) === index)
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
        errors.value.push(extractResult)
        return
      }

      // Set or add the registration to the formatted registrations
      setOrAddRegistration(extractResult as IRegistration)

      // Check for overlap errors among registrations
      const overlapErrors = checkForOverlap(Array.from(formattedRegistrations.value.values()))

      // If there are overlap errors, add them to the errors array
      if (overlapErrors.length !== 0) {
        errors.value.push(...overlapErrors)
      }
    }
  }

  // Function to set or add a registration to the formatted registrations
  function setOrAddRegistration(input: IRegistration) {
    const timeRanges: ITimeRange[] = [...input.timeRanges]
    let description = input.description ?? ''
    let clicked: boolean = input.clicked ?? false

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
        errors.value.push(`Opgaven med id'et '${input.letter}' har allerede en beskrivelse`)
        return
      }

      description = oldRegistration.description || input.description
      clicked = oldRegistration.clicked || input.clicked

      // Add old registration's time ranges to the new registration
      timeRanges.push(...oldRegistration.timeRanges)
    }

    // Set the registration in the formatted registrations map
    formattedRegistrations.value.set(input.letter, {
      letter: input.letter,
      timeRanges: timeRanges,
      description: description,
      clicked: clicked
    } as IRegistration)
  }



  return { formattedRegistrations, errors, registrationsArray, formatWithoutSaving, formatRegistrationsCallback, formatRegistrations, setOrAddRegistration }
})
