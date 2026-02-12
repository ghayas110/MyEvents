<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="eventsStore.isLoading" class="flex flex-col items-center justify-center min-h-[400px]">
        <div class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-slate-400">Fetching event details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="eventsStore.error" class="text-center py-20">
        <h2 class="text-2xl font-bold text-red-500 mb-4">{{ eventsStore.error }}</h2>
        <router-link to="/" class="text-primary hover:underline">Back to Events</router-link>
      </div>

      <!-- Content -->
      <div v-else-if="event" class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <!-- Hero Section -->
        <div class="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
          <img :src="event.thumbnail" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
          
          <div class="absolute bottom-8 left-8 right-8">
            <span class="px-4 py-1 bg-primary text-white text-sm font-bold rounded-full mb-4 inline-block">
              {{ event.category }}
            </span>
            <h1 class="text-4xl sm:text-5xl font-extrabold text-white tracking-tight line-clamp-2">
              {{ event.title }}
            </h1>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-8">
            <section>
              <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <FileTextIcon class="w-5 h-5 mr-2 text-primary" />
                About this Event
              </h2>
              <div class="prose prose-invert max-w-none text-slate-400 leading-relaxed" v-html="sanitizedDescription"></div>
            </section>

            <section>
              <h2 class="text-xl font-bold text-white mb-4 flex items-center">
                <MapPinIcon class="w-5 h-5 mr-2 text-primary" />
                Location
              </h2>
              <div class="h-[300px]">
                <AppMap :lat="event.lat || 0" :lng="event.lng || 0" :title="event.location" />
              </div>
              <p class="mt-4 text-slate-400 font-medium">{{ event.location }}, {{ event.city }}</p>
            </section>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl sticky top-24">
              <div class="space-y-4">
                <div class="flex items-center space-x-3 text-slate-300">
                  <CalendarIcon class="w-5 h-5 text-primary" />
                  <span>{{ formatDate(event.date) }}</span>
                </div>
                <div class="flex items-center space-x-3 text-slate-300">
                  <UsersIcon class="w-5 h-5 text-primary" />
                  <span>{{ event.attendeeCount }} People Attending</span>
                </div>
                
                <!-- Real Attendee Avatars -->
                <div v-if="usersStore.users.length > 0" class="flex items-center -space-x-2 overflow-hidden py-2">
                  <img 
                    v-for="user in usersStore.users.slice(0, 5)" 
                    :key="user.id"
                    :src="user.avatar"
                    :title="`${user.first_name} ${user.last_name}`"
                    class="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800"
                  />
                  <div v-if="usersStore.users.length > 5" class="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 text-[10px] font-bold text-slate-400">
                    +{{ usersStore.users.length - 5 }}
                  </div>
                </div>
              </div>

              <div class="pt-6 border-t border-slate-800">
                <h3 class="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Organizer</h3>
                <div class="flex items-center space-x-3 mb-4">
                  <div class="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-primary font-bold">
                    {{ event.organizer.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-white font-medium">{{ event.organizer }}</p>
                    <button class="text-xs text-primary hover:underline">Contact Organizer</button>
                  </div>
                </div>
              </div>

              <button 
                @click="registerForEvent"
                :disabled="isRegistering"
                class="w-full py-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
              >
                {{ isRegistering ? 'Registering...' : 'Register Now' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  FileText as FileTextIcon, 
  MapPin as MapPinIcon, 
  Calendar as CalendarIcon, 
  Users as UsersIcon 
} from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'
import AppMap from '@/components/common/AppMap.vue'
import { useEventsStore } from '@/store/events'
import { useUIStore } from '@/store/ui'
import { useUsersStore } from '@/store/users'
import { format } from 'date-fns'
import DOMPurify from 'dompurify'

const route = useRoute()
const eventsStore = useEventsStore()
const uiStore = useUIStore()
const usersStore = useUsersStore()

const isRegistering = ref(false)

const event = computed(() => eventsStore.currentEvent)

const sanitizedDescription = computed(() => {
  return DOMPurify.sanitize(event.value?.description || '')
})

onMounted(() => {
  const id = route.params.id as string
  eventsStore.fetchEventById(id)
  usersStore.fetchUsers() // Fetch sample attendees
})

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'eeee, MMMM dd, yyyy • hh:mm a')
  } catch (e) {
    return dateString
  }
}

const registerForEvent = async () => {
  if (!event.value) return
  
  isRegistering.value = true
  try {
    await eventsStore.registerForEvent(event.value.id)
    uiStore.notify(`Successfully registered for ${event.value.title}!`, 'success')
  } catch (e) {
    uiStore.notify('Registration failed. Please try again.', 'error')
  } finally {
    isRegistering.value = false
  }
}
</script>
