<template>
  <div class="relative">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center z-10 overflow-auto"
    >
      <!-- Modal overlay -->
      <div
        @click="changeModalState(false)"
        class="fixed inset-0 bg-black opacity-50 cursor-pointer"
      ></div>

      <!-- Modal content -->
      <div class="bg-background p-8 rounded shadow-lg z-10 max-h-[80vh] overflow-y-auto">
        <!-- Modal content goes here -->
        <HistoricalDates
          v-if="registrationData.length == 0"
          @clickedDate="loadData"
          :dates="sortedDates"
        />
        <div v-else>
          <div class="flex mb-2">
            <img
              src="@/assets/back-arrow.svg"
              @click="clearData"
              alt="Back arrow"
              class="w-8 h-8 fill-primary stroke-primary cursor-pointer mr-4"
            />
            <p class="mb-2">
              🕐Timer Totalt:
              <span class="font-bold"> {{ calculateTotalTime(registrationData) }} </span>-
              {{ selectedDate }}
            </p>
          </div>
          <RegistrationTable :registrations="registrationData" :clickable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- ...rest of the script setup remains unchanged -->

<script setup lang="ts">
import { ref } from 'vue'
import { loadFromStorage, calculateTotalTime, loadDatesFromLocalStorage } from '@/helpers'
import { useRegistrationStore } from '@/stores/RegistrationStore'

import HistoricalDates from './HistoricalDates.vue'
import RegistrationTable from '@/components/RegistrationTable.vue'
import type { IRegistration } from '@/interfaces'

const registrationStore = useRegistrationStore()

defineExpose({ changeModalState })

// State to track if the modal is open or closed
const isModalOpen = ref<boolean>(false)
const registrationData = ref<IRegistration[]>([])
const selectedDate = ref<string>('')

// Example usage

function sortDatesDescending(dates: string[]) {
  return dates.sort((a: string, b: string) => {
    const dateA: number = new Date(a).getTime()
    const dateB: number = new Date(b).getTime()

    // Compare the dates in descending order
    return dateB - dateA
  })
}

const sortedDates = sortDatesDescending(loadDatesFromLocalStorage())

// Function to open the modal
function changeModalState(visible: boolean) {
  clearData()
  isModalOpen.value = visible
}

function loadData(date: string) {
  const data = loadFromStorage(date)

  if (!data) {
    // Toast
    alert(`Data for ${date} could not be found`)
  }

  registrationData.value = registrationStore.formatWithoutSaving(data)
  selectedDate.value = date
}

function clearData() {
  registrationData.value = []
  selectedDate.value = ''
}
</script>
