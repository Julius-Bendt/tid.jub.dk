<template>
  <table class="w-full text-sm text-left text-gray-500 rounded-md overflow-hidden">
    <thead class="text-xs text-text uppercase bg-gray-800">
      <tr>
        <th scope="col" class="w-1/12 px-6 py-3">ID</th>
        <th scope="col" class="w-1/12 px-6 py-3">Periode</th>
        <th scope="col" class="w-1/12 px-6 py-3">Tid</th>
        <th scope="col" class="w-9/12 px-6 py-3">Beskrivelse</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="registration in props.registrations"
        :key="registration.letter"
        @click="clickRegistration(registration)"
        class="text-text transition-colors"
        :class="{
          'opacity-50': registration.clicked,
          'cursor-pointer': props.clickable && !registration.showAsWarning,
          'bg-yellow-600': registration.showAsWarning,
          'odd:bg-gray-900 even:bg-gray-800 hover:bg-primary border-b last:border-b-0 border-gray-700':
            !registration.showAsWarning
        }"
      >
        <th scope="row" class="w-1/12 px-6 py-4 font-bold">
          {{ registration.showAsWarning ? '' : registration.letter }}
        </th>
        <td class="w-1/12 px-6 py-4">
          {{ getTimePeriods(registration) }}
        </td>
        <td class="w-1/12 px-6 py-4">
          {{ calculateTotalTimeForRegistration(registration) / 60 }}
        </td>
        <td class="w-9/12 px-6 py-4">
          <div class="flex flex-col w-full">
            <p class="break-all w-full">{{ registration.description }}</p>
            <span v-for="(error, i) in registration.errors" :key="i" class="text-red-600"
              >{{ error }}
            </span>
            <span v-for="(warning, i) in registration.warnings" :key="i" class="text-yellow-600"
              >{{ warning }}
            </span>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { IRegistration } from '@/interfaces'
import { calculateTotalTimeForRegistration, formatTime } from '@/helpers'
import { useToast } from 'vue-toast-notification'

const emit = defineEmits(['registrationClicked'])

const props = defineProps({
  registrations: { type: Array<IRegistration>, default: () => [] },
  clickable: { type: Boolean, default: () => true }
})

function getTimePeriods(registration: IRegistration): string {
  const ranges: string[] = []

  registration.timeRanges.forEach((range) => {
    // Appends a "0", if the time is before 1000. 900 --> 0900
    const start = formatTime(range.startTime)
    const end = formatTime(range.endTime)

    ranges.push(`${start}-${end}`)
  })

  return ranges.join(', ')
}

function clickRegistration(registration: IRegistration) {
  if (!props.clickable || registration.showAsWarning) {
    return
  }

  // Send event
  emit('registrationClicked', registration)

  // Deselect
  if (!registration.clicked) {
    const $toast = useToast()
    $toast.clear()
    $toast.info(`Deselected ${registration.letter} - ${registration.description}`)
    return
  }

  // Else was selected

  copyToClipboard(registration.description)
}

// Function to copy a string to the clipboard and display an alert
function copyToClipboard(input: string) {
  navigator.clipboard.writeText(input)
  const $toast = useToast()
  $toast.clear()
  $toast.info(`Copied "${input}"`)
}
</script>
