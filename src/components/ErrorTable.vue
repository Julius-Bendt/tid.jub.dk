<template>
  <table class="w-full text-sm text-left rtl:text-right text-gray-500">
    <thead class="text-xs text-text uppercase bg-gray-800">
      <tr>
        <th scope="col" class="px-6 py-3">Fejl</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(error, i) in props.errors"
        :key="i"
        class="odd:bg-gray-900 even:bg-gray-800 border-b border-gray-700 hover:bg-primary text-text cursor-pointer transition-colors"
      >
        <td class="px-6 py-4">{{ error }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps({
  errors: { type: Array<string>, default: () => [] }
})
</script>
