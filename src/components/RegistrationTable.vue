<template>
  <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
        class="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-primary text-text cursor-pointer transition-colors"
      >
        <th scope="row" class="px-6 py-4 font-bold">{{ registration.letter }}</th>
        <td class="px-6 py-4">{{ getTimePeriods(registration) }}</td>
        <td class="px-6 py-4">{{ calculateTotalTimeForRegistration(registration) / 60 }}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          {{ registration.description }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import type { IRegistration } from '@/interfaces'

const props = defineProps({
  registrations: { type: Array<IRegistration>, default: () => [] },
  bar: Number
})

function getTimePeriods(registration: IRegistration): string {
  const ranges = []

  registration.timeRanges.forEach((range) => {
    ranges.push(`${range.startTime}-${range.endTime}`)
  })

  return ranges.join(', ')
}

function onClickRegistration(registration: IRegistration) {}

function calculateTotalTimeForRegistration(registration: IRegistration): number {
  return registration.timeRanges.reduce((result, current) => {
    return result + current.duration
  }, 0)
}
</script>
