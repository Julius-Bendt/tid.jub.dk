<template>
  <div class="p-4 min-h-screen w-screen bg-background text-text">
    <HistoricalRegistrationModal ref="modalRef" />
    <main class="grid grid-cols-2 mt-2 gap-4">
      <div>
        <textarea
          rows="24"
          v-model="registrationsText"
          @input="registrationsDebounced"
          class="block p-2.5 w-full text-sm rounded-lg border border-primary bg-backgroundSecondary focus:ring-primary focus:border-primary transition-all"
          placeholder="Skriv tidsregisteringer her...
Indsæt opgaver i følgende format: (fra)hhmm-(til)hhmm: {ID} - {beskrivelse af opgave}.
0900-1000: A - oprettede tid.jub.dk projekt
1000-1015: B - Importerede tailwind til tids-projekt
1015-1045: A (OBS: Opgaven med id'et 'A' har allerede en beskrivelse, hvorfor en ny ikke er nødvendig)

Husk du kan klikke på en besked under 'formatteret' for at kopiere denne til clipboardet

Data forlader aldrig browseren og sendes ikke til nogen server. Alle beregninger sker lokalt i din browser. We all 'bout that privacy! 🔒'
"
        ></textarea>
      </div>
      <div>
        <div class="flex justify-between px-2">
          <p class="mb-2">
            🕐Timer Totalt:
            <span class="font-bold">
              {{ calculateTotalTime(registrationStore.registrationArray) }}
            </span>
          </p>
          <a class="text-primary" href="#" @click="openModal" v-if="modalRef != null"
            >🗓️ Se tidligere registeringer</a
          >
        </div>

        <RegistrationTable
          :registrations="registrationStore.registrationArray"
          @registrationClicked="registrationClicked"
        />
      </div>
    </main>
    <FooterNav />
  </div>
</template>

<script setup lang="ts">
import { useRegistrationStore } from '@/stores/RegistrationStore'

import { ref, nextTick } from 'vue'
import type { IRegistration } from '@/interfaces'
import { calculateTotalTime, debounce } from '@/helpers'

import RegistrationTable from '@/components/RegistrationTable.vue'
import FooterNav from '@/components/FooterNav.vue'
import HistoricalRegistrationModal from '@/components/historical/HistoricalRegistrationModal.vue'
import { loadFromStorage } from './services'

const registrationStore = useRegistrationStore()

const modalRef = ref(null)
const registrationsText = ref(loadFromStorage()) // The panel to the left
// If any string was found in the cache, format it
if (registrationsText.value != '') {
  nextTick(() => {
    registrationStore.formatRegistrationsCallback(registrationsText.value)
  })
}

const registrationsDebounced = debounce(debounceHelper, 200)

function debounceHelper() {
  registrationStore.formatRegistrationsCallback(registrationsText.value)
}

function registrationClicked(input: IRegistration) {
  const registration: IRegistration = registrationStore.formattedRegistrations.get(
    input.letter
  ) as IRegistration

  // I did not expect this to work without modifying the map itself. apparently it does indeed update.
  registration.clicked = !registration.clicked
}

function openModal() {
  modalRef?.value?.changeModalState(true)
}
</script>
