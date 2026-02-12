<template>
  <div v-if="isVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
    <div class="flex flex-col items-center">
      <div class="relative w-24 h-24 mb-6">
        <div class="absolute inset-0 border-4 border-primary rounded-full animate-ping opacity-25"></div>
        <div class="absolute inset-2 border-4 border-blue-400 rounded-full animate-spin"></div>
        <div class="absolute inset-0 flex items-center justify-center">
          <span class="text-3xl font-bold text-white">ME</span>
        </div>
      </div>
      <h1 class="text-2xl font-bold text-white tracking-widest animate-pulse">MyEvents</h1>
      <div class="mt-8 flex space-x-2">
        <div class="w-2 h-2 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div class="w-2 h-2 bg-slate-700 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div class="w-2 h-2 bg-slate-700 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean
}>()
</script>

<style scoped>
.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>
