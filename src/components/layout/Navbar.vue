<template>
  <nav class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex-shrink-0 flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">ME</span>
            </div>
            <span class="text-xl font-bold text-white tracking-tight">MyEvents</span>
          </router-link>
          
          <nav class="ml-8 items-center space-x-6 hidden lg:flex">
             <router-link to="/" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">Browse</router-link>
             <router-link to="/create-event" class="text-slate-400 hover:text-white text-sm font-medium transition-colors">Create Event</router-link>
          </nav>
        </div>

        <div class="hidden md:block flex-grow max-w-md mx-8">
          <div class="relative">
            <SearchIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search events, cities..."
              class="w-full bg-slate-900 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <button class="p-2 text-slate-400 hover:text-white transition-colors relative">
            <BellIcon class="w-6 h-6" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div class="relative group">
            <button class="flex items-center space-x-2 p-1 rounded-full border border-slate-800 hover:border-slate-700 transition-all">
              <img 
                :src="authStore.user?.avatar || 'https://i.pravatar.cc/150?u=myevents'" 
                class="w-8 h-8 rounded-full bg-slate-800"
              />
              <ChevronDownIcon class="w-4 h-4 text-slate-400" />
            </button>
            
            <div class="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <div class="p-4 border-b border-slate-800">
                <p class="text-sm font-semibold text-white">{{ authStore.user?.first_name }} {{ authStore.user?.last_name }}</p>
                <p class="text-xs text-slate-500 truncate">{{ authStore.user?.email }}</p>
              </div>
              <div class="p-2">
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <LogOutIcon class="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { 
  Search as SearchIcon, 
  Bell as BellIcon, 
  ChevronDown as ChevronDownIcon,
  LogOut as LogOutIcon
} from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
