<template>
  <div class="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
    <SplashScreen :isVisible="isAppLoading" />
    <AppToast />
    
    <router-view v-if="!isAppLoading" v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import SplashScreen from '@/components/common/SplashScreen.vue'
import AppToast from '@/components/common/AppToast.vue'
import { useAuthStore } from '@/store/auth'

const isAppLoading = ref(true)
const authStore = useAuthStore()

onMounted(async () => {
  // Simulate bootstrapping delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Attempt auto-login if token exists
  await authStore.initAuth()
  
  isAppLoading.value = false
})
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
