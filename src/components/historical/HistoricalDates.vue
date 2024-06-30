<template>
  <table class="w-full text-sm text-left rtl:text-right text-gray-500">
    <tbody class="overflow-y-auto">
      <tr
        v-for="(date, i) in sortedDates"
        :key="i"
        @click="dateClicked(date)"
        class="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-primary text-text cursor-pointer transition-colors"
      >
        <td class="px-6 py-4">{{ date }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { loadDatesFromLocalStorage } from '@/services'
import { ref } from 'vue'

const emit = defineEmits(['clickedDate'])

defineExpose({
  loadData
})

const sortedDates = ref<any[]>([])
loadData()

function loadData() {
  sortedDates.value = sortDatesDescending(loadDatesFromLocalStorage())
}

function dateClicked(date: string) {
  emit('clickedDate', date)
}

function sortDatesDescending(dates: string[]) {
  return dates.sort((a: string, b: string) => {
    const dateA: number = new Date(a).getTime()
    const dateB: number = new Date(b).getTime()

    // Compare the dates in descending order
    return dateB - dateA
  })
}
</script>
