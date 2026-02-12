<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-slate-950">
    <div class="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
      <!-- Logo & Header -->
      <div class="text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-6">
          <CalendarIcon class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-extrabold text-white tracking-tight">MyEvents</h1>
        <p class="mt-2 text-slate-400">
          {{ authStore.isVerifying ? 'Enter verification code' : subheaderText }}
        </p>
      </div>

      <!-- Tabs -->
      <div v-if="!authStore.isVerifying" class="flex p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button 
          v-for="mode in (['magic', 'password', 'register'] as const)" 
          :key="mode"
          @click="authMode = mode"
          :class="[
            'flex-1 py-2 text-xs font-bold rounded-xl transition-all capitalize',
            authMode === mode ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
          ]"
        >
          {{ mode === 'magic' ? 'Magic Link' : mode }}
        </button>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <!-- Step 1: Request Magic Link -->
        <Form 
          v-if="!authStore.isVerifying && authMode === 'magic'" 
          @submit="handleRequestLink" 
          :validation-schema="loginSchema"
          class="space-y-6"
        >
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            <div class="relative">
              <MailIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Field 
                name="email" 
                type="email" 
                class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                placeholder="name@example.com"
              />
            </div>
            <ErrorMessage name="email" class="text-red-500 text-xs mt-1" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex justify-center items-center disabled:opacity-50">
            <Loader2Icon v-if="isLoading" class="w-5 h-5 animate-spin mr-2" />
            Send Link
          </button>
        </Form>

        <!-- Standard Login / Register flow -->
        <Form 
          v-if="!authStore.isVerifying && authMode !== 'magic'" 
          @submit="handleStandardSubmit" 
          :validation-schema="authMode === 'register' ? registerSchema : passwordSchema"
          class="space-y-6"
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <Field 
                name="email" 
                type="email" 
                class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <ErrorMessage name="email" class="text-red-500 text-xs mt-1" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <Field 
                name="password" 
                type="password" 
                class="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <ErrorMessage name="password" class="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-600 transition-all flex justify-center items-center disabled:opacity-50">
            <Loader2Icon v-if="isLoading" class="w-5 h-5 animate-spin mr-2" />
            {{ authMode === 'register' ? 'Join Community' : 'Sign In' }}
          </button>
        </Form>

        <!-- Step 2: Verify Magic Code -->
        <Form 
          v-if="authStore.isVerifying" 
          @submit="handleVerifyCode" 
          :validation-schema="verifySchema"
          class="space-y-6"
        >
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">6-Digit Code</label>
            <Field 
              name="token" 
              type="text" 
              class="w-full bg-slate-800 border border-slate-700 rounded-xl py-4 px-4 text-white font-mono text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <ErrorMessage name="token" class="text-red-500 text-xs mt-1 text-center" />
          </div>

          <button type="submit" :disabled="isLoading" class="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex justify-center items-center disabled:opacity-50">
            <Loader2Icon v-if="isLoading" class="w-5 h-5 animate-spin mr-2" />
            Verify Account
          </button>
          <button @click="authStore.isVerifying = false" type="button" class="w-full text-slate-500 hover:text-slate-300 text-sm font-medium py-2">Change Email</button>
        </Form>

        <div v-if="error" class="mt-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-sm flex items-start space-x-2">
          <AlertCircleIcon class="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{{ error }}</span>
        </div>
      </div>

       <p class="text-center text-slate-500 text-sm mt-8">
        By continuing, you agree to our <a href="#" class="underline">Terms</a> and <a href="#" class="underline">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'
import { 
  Calendar as CalendarIcon, 
  Mail as MailIcon, 
  Loader2 as Loader2Icon, 
  AlertCircle as AlertCircleIcon 
} from 'lucide-vue-next'
import { useAuthStore } from '@/store/auth'
import { useUIStore } from '@/store/ui'
import { useUsersStore } from '@/store/users'

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const usersStore = useUsersStore()

const authMode = ref<'magic' | 'password' | 'register'>('magic')
const isLoading = ref(false)
const error = ref('')

const subheaderText = computed(() => {
  if (authMode.value === 'magic') return 'Secure passwordless login'
  if (authMode.value === 'password') return 'Sign in with your credentials'
  return 'Create your account'
})

const loginSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email address'),
})

const passwordSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email address'),
  password: yup.string().required('Password is required'),
})

const registerSchema = yup.object({
  email: yup.string().required('Email is required').email('Invalid email address')
    .test('check-email', 'Email is already taken', async (value) => {
      if (!value) return true
      return await usersStore.checkEmailAvailability(value)
    }),
  password: yup.string().required('Password is required').min(6, 'Min 6 characters'),
})

const verifySchema = yup.object({
  token: yup.string().required('Code is required').length(6, 'Must be 6 digits').matches(/^\d+$/, 'Digits only'),
})

const handleRequestLink = async (values: any) => {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.requestLink(values.email)
    uiStore.notify('Check your email for the code!')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Connection error. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handleStandardSubmit = async (values: any) => {
  isLoading.value = true
  error.value = ''
  try {
    if (authMode.value === 'register') {
      await authStore.register(values)
      uiStore.notify('Welcome to MyEvents!', 'success')
    } else {
      await authStore.login(values)
      uiStore.notify('Logged in successfully', 'success')
    }
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.error || e.message
  } finally {
    isLoading.value = false
  }
}

const handleVerifyCode = async (values: any) => {
  isLoading.value = true
  error.value = ''
  try {
    await authStore.verifyCode(values.token)
    uiStore.notify('Verification complete', 'success')
    router.push('/')
  } catch (e: any) {
    error.value = 'Invalid code. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>
