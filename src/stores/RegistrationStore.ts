import type { IRegistration } from '@/interfaces'
import {
  toRawDeep,
} from '@/helpers'

import {
  saveToStorage,
  loadFromStorage,
  formatRegistrations,
} from "@/services"

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRegistrationStore = defineStore('registrationStore', () => {

  const registrationArray = ref<IRegistration[]>([]);

  function formatWithoutSaving(registrationsText: string | undefined) {
    const tempDataString = loadFromStorage();

    formatRegistrationsCallback(registrationsText);
    const registrations = structuredClone(toRawDeep(registrationArray.value));

    formatRegistrationsCallback(tempDataString);
    return registrations;

  }
  // Function to clear previous formatted registrations, process input, and handle errors
  function formatRegistrationsCallback(registrationsText: string | undefined) {

    if (registrationsText == undefined || registrationsText == "") {
      return;
    }

    // Clear previous formatted registrations and errors
    registrationArray.value = [];

    // Split input text into an array of strings based on new lines
    const registrationLines = registrationsText.split(/\r?\n/)

    // Format registrations and handle errors
    registrationArray.value = formatRegistrations(registrationLines).sort((a, b) => {

      a.timeRanges = a.timeRanges.sort((aa, bb) => aa.startTime - bb.startTime); // Sort time ranges
      return a.timeRanges[0].startTime - b.timeRanges[0].startTime // Show earliest first
    });


    // Remove duplicate errors
    saveToStorage(registrationsText)
  }

  return { registrationArray, formatWithoutSaving, formatRegistrationsCallback, formatRegistrations }
})
