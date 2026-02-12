<template>
  <div class="fixed bottom-4 right-4 z-[100] space-y-2 pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in uiStore.toasts" 
        :key="toast.id"
        :class="[
          'pointer-events-auto px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-white border min-w-[300px]',
          toast.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 
          toast.type === 'error' ? 'bg-red-600 border-red-500' : 'bg-blue-600 border-blue-500'
        ]"
      >
        <CheckCircleIcon v-if="toast.type === 'success'" class="w-5 h-5 flex-shrink-0" />
        <AlertCircleIcon v-else-if="toast.type === 'error'" class="w-5 h-5 flex-shrink-0" />
        <InfoIcon v-else class="w-5 h-5 flex-shrink-0" />
        
        <p class="text-sm font-medium">{{ toast.message }}</p>
        
        <button @click="uiStore.removeToast(toast.id)" class="ml-auto opacity-70 hover:opacity-100 p-1">
          <XIcon class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { 
  CheckCircle as CheckCircleIcon, 
  AlertCircle as AlertCircleIcon, 
  Info as InfoIcon,
  X as XIcon
} from 'lucide-vue-next'
import { useUIStore } from '@/store/ui'

const uiStore = useUIStore()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.toast-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
