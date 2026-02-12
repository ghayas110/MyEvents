<template>
  <div class="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-700 transition-all group">
    <!-- Thumbnail -->
    <div class="relative aspect-video overflow-hidden">
      <img 
        :src="event.thumbnail" 
        :alt="event.title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />
      <div class="absolute top-4 left-4">
        <span class="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
          {{ event.category }}
        </span>
      </div>
      <button 
        @click.stop="$emit('toggle-favorite')"
        class="absolute top-4 right-4 p-2 bg-slate-950/50 backdrop-blur-md rounded-full text-white hover:text-red-500 transition-colors"
      >
        <component 
          :is="event.isFavorited ? HeartIconFilled : HeartIcon" 
          :class="['w-5 h-5', event.isFavorited ? 'text-red-500 fill-red-500' : '']" 
        />
      </button>
      <div class="absolute bottom-4 left-4 flex items-center space-x-2 text-white bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full text-xs">
        <UsersIcon class="w-4 h-4" />
        <span>{{ event.attendeeCount }} Attending</span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex flex-col h-full">
      <div class="flex items-center text-primary text-xs font-semibold mb-2 uppercase tracking-wide">
        <CalendarIcon class="w-4 h-4 mr-1" />
        <span>{{ formatDate(event.date) }}</span>
      </div>
      
      <h3 class="text-xl font-bold text-white mb-2 line-clamp-1">{{ event.title }}</h3>
      <p class="text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">{{ event.description }}</p>
      
      <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-800">
        <div class="flex items-center text-slate-400 text-sm">
          <MapPinIcon class="w-4 h-4 mr-1" />
          <span>{{ event.city }}</span>
        </div>
        <router-link 
          :to="`/event/${event.id}`"
          class="text-primary hover:text-blue-400 font-semibold text-sm flex items-center transition-colors"
        >
          Details
          <ChevronRightIcon class="w-4 h-4 ml-1" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Heart as HeartIcon, 
  Users as UsersIcon, 
  Calendar as CalendarIcon, 
  MapPin as MapPinIcon, 
  ChevronRight as ChevronRightIcon 
} from 'lucide-vue-next'
import { Heart as HeartIconFilled } from 'lucide-vue-next'
import type { Event } from '@/services/events'
import { format } from 'date-fns'

defineProps<{
  event: Event
}>()

defineEmits(['toggle-favorite'])

const formatDate = (dateString: string) => {
  try {
    return format(new Date(dateString), 'MMM dd, yyyy • hh:mm a')
  } catch (e) {
    return dateString
  }
}
</script>
