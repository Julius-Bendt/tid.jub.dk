<template>
  <table class="w-full text-sm text-left rtl:text-right text-gray-500">
    <thead class="text-xs text-text uppercase bg-gray-800">
      <tr>
        <th scope="col" class="px-6 py-3">ID</th>
        <th scope="col" class="px-6 py-3">Periode</th>
        <th scope="col" class="px-6 py-3">Tid</th>
        <th scope="col" class="px-6 py-3">Beskrivelse</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="registration in props.registrations"
        :key="registration.letter"
        @click="clickRegistration(registration)"
        class="border-b border-gray-700 hover:bg-primary text-text cursor-pointer transition-colors"
        :class="{
          'text-gray-600 bg-gray-700': registration.clicked,
          'odd:bg-gray-900 even:bg-gray-800': !registration.clicked
        }"
      >
        <th scope="row" class="px-6 py-4 font-bold">{{ registration.letter }}</th>
        <td class="px-6 py-4">{{ getTimePeriods(registration) }}</td>
        <td class="px-6 py-4">{{ calculateTotalTimeForRegistration(registration) / 60 }}</td>
        <td class="px-6 py-4">
          {{ registration.description }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { IRegistration } from '@/interfaces'
import { calculateTotalTimeForRegistration } from '@/helpers'
import { useToast } from 'vue-toast-notification'

const emit = defineEmits(['registrationClicked'])

const props = defineProps({
  registrations: { type: Array<IRegistration>, default: () => [] },
  bar: Number
})

function getTimePeriods(registration: IRegistration): string {
  const ranges: string[] = []

  registration.timeRanges.forEach((range) => {
    // Appends a "0", if the time is before 1000. 900 --> 0900
    const start = range.startTime < 1000 ? `0${range.startTime}` : range.startTime
    const end = range.endTime < 1000 ? `0${range.endTime}` : range.endTime

    ranges.push(`${start}-${end}`)
  })

  return ranges.reverse().join(', ')
}

function clickRegistration(registration: IRegistration) {
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
