<template>
  <div class="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 animate-pulse">
    <!-- Thumbnail Placeholder -->
    <div class="aspect-video bg-slate-800"></div>

    <!-- Content Placeholder -->
    <div class="p-5 space-y-4">
      <div class="h-4 bg-slate-800 rounded w-1/4"></div>
      <div class="h-6 bg-slate-800 rounded w-3/4"></div>
      <div class="space-y-2">
        <div class="h-4 bg-slate-800 rounded w-full"></div>
        <div class="h-4 bg-slate-800 rounded w-5/6"></div>
      </div>
      <div class="pt-4 border-t border-slate-800 flex justify-between">
        <div class="h-4 bg-slate-800 rounded w-1/3"></div>
        <div class="h-4 bg-slate-800 rounded w-1/4"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
