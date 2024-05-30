<template>
  <div>
    <div v-for="item in props.foundItems" :key="item.date" class="mb-2">
      <h2 class="text-lg">{{ item.date }}</h2>
      <RegistrationTable :registrations="item.registrations" :clickable="false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ISearchItem } from '@/interfaces/ISearchItem'
import RegistrationTable from '../RegistrationTable.vue'
const props = defineProps({
  foundItems: { type: Array<ISearchItem>, default: () => '' }
})
</script>
