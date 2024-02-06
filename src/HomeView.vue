<template>
  <div class="p-4 h-screen w-screen bg-background text-text">
    <div class="flex justify-between">
      <h1 class="text-xl font-bold">Hjælper til tidsregistrering</h1>
      <a href="https://github.com/Julius-Bendt/tid.jub.dk" class="text-primary" target="_blank">
        Github repository
      </a>
    </div>
    <main class="grid grid-cols-2 mt-2 gap-4">
      <div>
        <h2 class="text-lg font-bold mb-2">Register</h2>

        <textarea
          rows="24"
          v-model="registrationsText"
          @input="formatRegistrationsCallback"
          class="block p-2.5 w-full text-sm rounded-lg border border-primary bg-backgroundSecondary focus:ring-primary focus:border-primary transition-all"
          placeholder="Skriv tidsregisteringer her...
Indsæt opgaver i følgende format: (fra)hhmm-(til)hhmm: {ID} - {beskrivelse af opgave}.
0900-1000: A - oprettede tid.jub.dk projekt
1000-1015: B - Importerede tailwind til tids-projekt
1015-1045: A (OBS: Opgaven med id'et 'A' har allerede en beskrivelse, hvorfor en ny ikke er nødvendig)

Husk du kan klikke på en besked under 'formatteret' for at kopiere denne til clipboardet
"
        ></textarea>
      </div>
      <div>
        <h2 class="text-lg font-bold mb-2">Formatteret</h2>
        <div v-if="errors.length == 0">
          <p class="font-bold pt-3">Total: {{ calculateTotalTime(registrationsArray) }}</p>
          <RegistrationTable v-if="errors.length == 0" :registrations="registrationsArray" />
        </div>

        <ul v-else>
          <li v-for="(error, i) in errors" :key="i">
            {{ error }}
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import type { IRegistration, ITimeRange } from '@/interfaces'
import {
  extractWithDescription,
  extractFromId,
  checkForOverlap,
  calculateTotalTime,
  loadFromStorage,
  saveToStorage
} from '@/helpers'

import RegistrationTable from '@/components/RegistrationTable.vue'

const registrationsText = ref(loadFromStorage()) // The panel to the left
// If any string was found in the cache, format it
if (registrationsText.value != '') {
  nextTick(() => {
    formatRegistrationsCallback()
  })
}

const formattedRegistrations = ref<Map<string, IRegistration>>(new Map())
const errors = ref<string[]>([])

const registrationsArray = computed(() => Array.from(formattedRegistrations.value.values()))

// Function to clear previous formatted registrations, process input, and handle errors
function formatRegistrationsCallback() {
  // Clear previous formatted registrations and errors
  formattedRegistrations.value.clear()
  errors.value = []

  // Split input text into an array of strings based on new lines
  const registrations = registrationsText.value.split(/\r?\n/)

  // Format registrations and handle errors
  formatRegistrations(registrations)

  // Remove duplicate errors
  errors.value = errors.value.filter((error, index, self) => self.indexOf(error) === index)
  saveToStorage(registrationsText.value)
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
    const extractResult = inputString.includes(' - ')
      ? extractWithDescription(inputString)
      : extractFromId(inputString)

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
  let description = input.description

  if (formattedRegistrations.value.has(input.letter)) {
    const oldRegistration: IRegistration = formattedRegistrations.value.get(
      input.letter
    ) as IRegistration

    // Not really needed, but static code analysis kept complaining
    if (!oldRegistration) {
      console.error('Something went wrong finding this registration:', input)
      return
    }

    // If the old registration has a description, use it
    if (oldRegistration.description !== '') {
      description = oldRegistration.description
    }

    // Add old registration's time ranges to the new registration
    timeRanges.push(...oldRegistration.timeRanges)
  }

  // Set the registration in the formatted registrations map
  formattedRegistrations.value.set(input.letter, {
    letter: input.letter,
    timeRanges: timeRanges,
    description: description
  } as IRegistration)
}
</script>
