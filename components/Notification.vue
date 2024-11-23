<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-8 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-8 opacity-0"
  >
    <div
      v-if="analyserStore.analyserNotification"
      class="fixed top-4 right-4 bg-#1e1f20 text-white w-full max-w-[18rem] p-4 rounded-md shadow-lg z-1 flex items-start gap-2"
    >
      <i class="i-heroicons-bell size-5 shrink-0" />
      <span>{{ analyserStore.analyserNotification }}</span>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import useAnalyserStore from '~/stores/analyserStore'

const analyserStore = useAnalyserStore()
</script>
