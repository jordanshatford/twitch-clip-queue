<template>
  <div class="flex items-center">
    <div class="h-5">
      <svg v-if="svg" class="mr-2 h-5 w-5" v-html="svg"></svg>
    </div>
    <div>{{ provider }}</div>
  </div>
</template>

<script setup lang="ts">
import type { ClipProvider } from '@cq/providers'
import { useProviders } from '@/stores/providers'

export interface Props {
  provider: ClipProvider
}

const props = defineProps<Props>()

const providers = useProviders()

const svg = providers.providers?.[props.provider]?.svg
</script>
