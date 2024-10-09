<template>
  <div class="relative">
    <Transition>
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
          <header v-if="registrationData.length == 0">
            <h2 class="text-2xl font-bold">Registeringer fra tidligere dage:</h2>
            <p class="mb-2">Klik på en tabel for at indlæse data eller søg efter opgave</p>

            <div class="mb-4">
              <input
                type="text"
                class="text-sm rounded-md block w-full p-2.5 bg-gray-800 placeholder-gray-400 text-white focus:ring-primary focus:border-primary focus:outline-primary"
                placeholder="Søg efter opgave - oprettede tid.jub.dk projekt"
                v-model="searchTerm"
                @input="onSearch"
              />
            </div>
            <div class="mb-4 grid grid-cols-2 gap-4">
              <button
                @click="setImport(!importing)"
                class="bg-transparent hover:bg-primary font-semibold py-2 px-4 border border-primary hover:border-transparent rounded transition-colors"
              >
                {{ importing ? 'Stop importing' : 'Impoter' }}
              </button>
              <button
                @click="exportClicked"
                class="bg-transparent hover:bg-primary font-semibold py-2 px-4 border border-primary hover:border-transparent rounded transition-colors"
              >
                Eksporter
              </button>
            </div>
          </header>

          <HistoricalDates
            v-if="registrationData.length == 0 && searchTerm === '' && !importing"
            @clickedDate="loadData"
            ref="historicalDate"
          />
          <HistoricalSearch v-if="searchTerm !== '' && !importing" :foundItems="foundSearchItems" />
          <div v-if="registrationData.length > 0 && searchTerm === '' && !importing">
            <div class="flex mb-2">
              <img
                src="@/assets/back-arrow.svg"
                @click="clearData"
                alt="Back arrow"
                class="w-8 h-8 fill-primary stroke-primary cursor-pointer mr-4"
              />
              <p class="mb-2">
                🕐Timer Totalt:
                <span class="font-bold"> {{ calculateTotalTime(registrationData) }} </span> -
                {{ selectedDate }}
              </p>
            </div>
            <RegistrationTable :registrations="registrationData" :clickable="false" />
          </div>

          <FileUpload @import-done="loadDataAndCloseImport" v-if="importing" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  exportRegistrations,
  formatRegistrations,
  loadFromStorage,
  searchLocalStorage
} from '@/services'

import { calculateTotalTime } from '@/helpers'

import HistoricalDates from './HistoricalDates.vue'
import RegistrationTable from '@/components/RegistrationTable.vue'
import HistoricalSearch from './HistoricalSearch.vue'
import FileUpload from './FileUpload.vue'

import type { IRegistration } from '@/interfaces'

import { useToast } from 'vue-toast-notification'
import type { ISearchItem } from '@/interfaces/ISearchItem'

defineExpose({ changeModalState })
const historicalDate = ref(null)

// State to track if the modal is open or closed
const isModalOpen = ref<boolean>(false)
const registrationData = ref<IRegistration[]>([])
const selectedDate = ref<string>('')
const importing = ref<boolean>(false)

// Function to open the modal
function changeModalState(visible: boolean) {
  clearData()
  isModalOpen.value = visible
}

function loadData(date: string) {
  const data = loadFromStorage(date)

  if (!data) {
    const $toast = useToast()
    $toast.clear()
    $toast.error(`Data for ${date} could not be found`)
    return
  }

  registrationData.value = formatRegistrations(data.split(/\r?\n/))
  selectedDate.value = date
}

function clearData() {
  registrationData.value = []
  selectedDate.value = ''
}

function setImport(value: boolean) {
  importing.value = value
}

function loadDataAndCloseImport() {
  setImport(false)

  if (historicalDate.value !== null) {
    historicalDate.value.loadData()
  }
}

function exportClicked() {
  exportRegistrations()
}

const searchTerm = ref<string>('')
const foundSearchItems = ref<ISearchItem[]>([])
function onSearch() {
  foundSearchItems.value = searchLocalStorage(searchTerm.value)
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.25s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
