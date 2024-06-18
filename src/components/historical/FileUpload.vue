<template>
  <div class="max-w-xl">
    <label
      class="flex justify-center w-full h-32 px-4 transition border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none"
    >
      <span class="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span class="font-medium" v-if="file === undefined">
          Drop file to import, or
          <span class="text-primary underline">browse</span>
        </span>
        <span class="font-medium" v-else> Selected {{ file.name }} </span>
      </span>
      <input type="file" name="file_upload" class="hidden" @change="doTheImporting" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import { importRegistrations } from '@/services'
import { ref } from 'vue'

const file = ref<File | undefined>(undefined)
const emit = defineEmits(['importDone'])

async function doTheImporting(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length) {
    return
  }

  file.value = input.files[0]

  if (file.value.type !== 'application/json') {
    //TODO: Show toast
    console.log('WRONG FILE TYPE')
    return
  }

  await importRegistrations(file.value)
  emit('importDone')
}
</script>
