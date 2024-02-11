<template>
  <div>
    <h2 class="text-2xl font-bold">Registeringer fra tidligere dage:</h2>
    <p class="mb-4">Klik på en tabel for at indlæse data</p>
    <table class="w-full text-sm text-left rtl:text-right text-gray-500">
      <tbody class="overflow-y-auto">
        <tr
          v-for="(date, i) in props.dates"
          :key="i"
          @click="dateClicked(date)"
          class="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-primary text-text cursor-pointer transition-colors"
        >
          <td class="px-6 py-4">{{ date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['clickedDate'])
const props = defineProps({
  dates: { type: Array<string>, default: () => [] }
})

function dateClicked(date: string) {
  emit('clickedDate', date)
}
</script>
