<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <main class="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Welcome Header -->
      <section class="mb-12">
        <h2 class="text-sm font-bold text-primary tracking-widest uppercase mb-2">Upcoming Events</h2>
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl tracking-tight">
          Discover experiences <br class="hidden sm:block" />
          <span class="text-slate-500 font-normal italic">tailored for you</span>
        </h1>
      </section>

      <!-- Category Filter (Mock) -->
      <section class="mb-8 flex overflow-x-auto pb-4 space-x-3 scrollbar-hide">
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="['px-6 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all', activeCategory === cat ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700']"
        >
          {{ cat }}
        </button>
      </section>

      <!-- Events List -->
      <div v-if="eventsStore.events.length === 0 && eventsStore.isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <SkeletonCard v-for="i in 6" :key="i" />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <EventCard 
          v-for="event in eventsStore.events" 
          :key="event.id" 
          :event="event"
          @toggle-favorite="eventsStore.toggleFavorite(event.id)"
        />
        
        <!-- Loading items during scroll -->
        <template v-if="eventsStore.isLoading && eventsStore.events.length > 0">
          <SkeletonCard v-for="i in 3" :key="i" />
        </template>
      </div>

      <!-- Infinite Scroll Observer Trigger -->
      <div ref="observerElement" class="h-20 flex items-center justify-center mt-8">
        <div v-if="eventsStore.isLoading && eventsStore.events.length > 0" class="flex flex-col items-center">
          <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span class="mt-2 text-xs text-slate-500">Loading more events...</span>
        </div>
        <p v-else-if="!eventsStore.hasMore" class="text-slate-500 text-sm italic">
          You've reached the end of the list.
        </p>
      </div>
    </main>

    <!-- Global Offline Banner -->
    <div v-if="!isOnline" class="fixed bottom-4 left-4 right-4 bg-orange-500/90 backdrop-blur text-white px-4 py-3 rounded-xl flex items-center justify-between shadow-2xl z-50">
      <div class="flex items-center space-x-3">
        <WifiOffIcon class="w-5 h-5 font-bold" />
        <span class="font-medium">Offline Mode: Showing cached data</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { WifiOff as WifiOffIcon } from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'
import EventCard from '@/components/events/EventCard.vue'
import SkeletonCard from '@/components/events/SkeletonCard.vue'
import { useEventsStore } from '@/store/events'

const eventsStore = useEventsStore()
const observerElement = ref<HTMLElement | null>(null)
const isOnline = ref(navigator.onLine)

const categories = ['All Events', 'Technology', 'Music', 'Workshops', 'Networking', 'Sports']
const activeCategory = ref('All Events')

let observer: IntersectionObserver | null = null

onMounted(async () => {
  // Initial fetch
  await eventsStore.fetchEvents(true)

  // Infinite Scroll Observer
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && eventsStore.hasMore && !eventsStore.isLoading) {
      eventsStore.fetchEvents()
    }
  }, { threshold: 0.1 })

  if (observerElement.value) {
    observer.observe(observerElement.value)
  }

  // Connectivity Listeners
  window.addEventListener('online', () => isOnline.value = true)
  window.addEventListener('offline', () => isOnline.value = false)
})

onUnmounted(() => {
  if (observer) observer.disconnect()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
