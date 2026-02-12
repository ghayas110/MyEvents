<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <main class="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-10 text-center">
        <h1 class="text-3xl font-bold text-white mb-2">Create New Event</h1>
        <p class="text-slate-400">Share your experience with the community.</p>
      </div>

      <!-- Stepper -->
      <div class="flex items-center justify-between mb-12 relative">
        <div class="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0"></div>
        <div 
          v-for="i in 4" :key="i"
          class="relative z-10 flex flex-col items-center"
        >
          <div 
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300',
              currentStep === i ? 'bg-primary text-white scale-125 shadow-lg shadow-primary/20' : 
              currentStep > i ? 'bg-emerald-500 text-white' : 'bg-slate-900 border border-slate-800 text-slate-500'
            ]"
          >
            <CheckIcon v-if="currentStep > i" class="w-5 h-5" />
            <span v-else>{{ i }}</span>
          </div>
          <span :class="['mt-2 text-xs font-medium', currentStep === i ? 'text-white' : 'text-slate-500']">
            {{ stepNames[i-1] }}
          </span>
        </div>
      </div>

      <!-- Form Container -->
      <div class="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden min-h-[400px]">
        <Form 
          @submit="handleNext" 
          :validation-schema="currentSchema"
          class="space-y-8"
        >
          <!-- Step 1: Basic Info -->
          <div v-if="currentStep === 1" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
              <Field 
                name="title" 
                class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Give it a catchy name"
              />
              <ErrorMessage name="title" class="text-red-500 text-xs mt-1" />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Category</label>
              <Field name="category" as="select" class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="" disabled>Select a category</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </Field>
              <ErrorMessage name="category" class="text-red-500 text-xs mt-1" />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Field 
                name="description" 
                as="textarea"
                rows="4"
                class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="What is this event about?"
              />
              <ErrorMessage name="description" class="text-red-500 text-xs mt-1" />
            </div>
          </div>

          <!-- Step 2: Logistics -->
          <div v-if="currentStep === 2" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Date & Time</label>
                <Field 
                  name="date" 
                  type="datetime-local"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <ErrorMessage name="date" class="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Attendee Limit (Optional)</label>
                <Field 
                  name="attendeeLimit" 
                  type="number"
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <ErrorMessage name="attendeeLimit" class="text-red-500 text-xs mt-1" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">City</label>
                <Field 
                  name="city" 
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <ErrorMessage name="city" class="text-red-500 text-xs mt-1" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-300 mb-2">Venue Address</label>
                <Field 
                  name="location" 
                  class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <ErrorMessage name="location" class="text-red-500 text-xs mt-1" />
              </div>
            </div>
          </div>

          <!-- Step 3: Media -->
          <div v-if="currentStep === 3" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label class="block text-sm font-medium text-slate-300 mb-4">Event Images (Max 5)</label>
              
              <div 
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="handleDrop"
                :class="[
                  'border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all',
                  isDragging ? 'border-primary bg-primary/5' : 'border-slate-800 hover:border-slate-700'
                ]"
              >
                <UploadCloudIcon class="w-12 h-12 text-slate-600 mb-4" />
                <p class="text-slate-400 text-center">
                  Drag and drop your images here, or 
                  <label class="text-primary cursor-pointer hover:underline">
                    browse files
                    <input type="file" multiple class="hidden" @change="handleFileSelect" accept="image/*" />
                  </label>
                </p>
                <p class="text-slate-600 text-xs mt-2">Maximum 5.0MB per image (JPG, PNG, WebP)</p>
              </div>

              <!-- Preview Grid -->
              <div v-if="previews.length > 0" class="grid grid-cols-3 sm:grid-cols-5 gap-4 mt-8">
                <div v-for="(src, idx) in previews" :key="idx" class="relative group aspect-square rounded-xl overflow-hidden border border-slate-800">
                  <img :src="src" class="w-full h-full object-cover" />
                  <button 
                    @click="removeImage(idx)"
                    class="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Review -->
          <div v-if="currentStep === 4" class="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 text-slate-300">
             <div class="space-y-4">
               <div>
                 <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Title</h4>
                 <p class="text-white text-lg font-bold">{{ formData.title }}</p>
               </div>
               <div class="grid grid-cols-2 gap-4">
                 <div>
                   <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Logistics</h4>
                   <p class="text-sm">{{ formData.city }} • {{ formData.date }}</p>
                 </div>
                 <div>
                    <h4 class="text-xs font-bold text-slate-600 uppercase tracking-widest mb-1">Category</h4>
                    <p class="text-sm">{{ formData.category }}</p>
                 </div>
               </div>
             </div>

             <div class="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-xl flex items-center space-x-3 text-emerald-500">
               <ShieldCheckIcon class="w-5 h-5" />
               <p class="text-sm font-medium">Auto-moderation: Your event will be live immediately.</p>
             </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-between pt-8 border-t border-slate-800">
            <button 
              v-if="currentStep > 1"
              type="button"
              @click="currentStep--"
              class="px-8 py-3 text-slate-400 hover:text-white transition-colors"
            >
              Back
            </button>
            <div class="flex-grow"></div>
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="px-10 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {{ currentStep === 4 ? (isSubmitting ? 'Creating...' : 'Launch Event') : 'Continue' }}
            </button>
          </div>
        </Form>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { 
  Check as CheckIcon, 
  UploadCloud as UploadCloudIcon, 
  Trash as TrashIcon,
  ShieldCheck as ShieldCheckIcon 
} from 'lucide-vue-next'
import Navbar from '@/components/layout/Navbar.vue'
import { eventSchema } from '@/utils/validators'
import { useUIStore } from '@/store/ui'
import { useEventManagement } from '@/composables/useEventManagement'
import * as yup from 'yup'

const router = useRouter()
const uiStore = useUIStore()
const { uploadImages, createEvent } = useEventManagement()

const currentStep = ref(1)
const stepNames = ['Basic Info', 'Details', 'Media', 'Review']
const categories = ['Technology', 'Music', 'Workshops', 'Networking', 'Sports']

const isDragging = ref(false)
const isSubmitting = ref(false)

const formData = ref<any>({
  title: '',
  category: '',
  description: '',
  date: '',
  city: '',
  location: '',
  attendeeLimit: null,
})

const previews = ref<string[]>([])
const selectedFiles = ref<File[]>([])

const currentSchema = computed(() => {
  if (currentStep.value === 1) {
    return yup.object({
      title: eventSchema.fields.title,
      category: eventSchema.fields.category,
      description: eventSchema.fields.description,
    })
  } else if (currentStep.value === 2) {
    return yup.object({
      date: eventSchema.fields.date,
      city: eventSchema.fields.city,
      location: eventSchema.fields.location,
    })
  }
  return yup.object({})
})

const handleNext = async (values: any) => {
  // Merge values into formData
  Object.assign(formData.value, values)
  
  if (currentStep.value < 4) {
    currentStep.value++
  } else {
    // Submit
    isSubmitting.value = true
    try {
      const imageUrls = await uploadImages(selectedFiles.value)
      await createEvent({ ...formData.value, thumbnail: imageUrls[0] || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87' })
      uiStore.notify('Event created successfully!', 'success')
      router.push('/')
    } catch (e) {
      uiStore.notify('Failed to create event', 'error')
    } finally {
      isSubmitting.value = false
    }
  }
}

const handleFileSelect = (e: any) => {
  const files = Array.from(e.target.files) as File[]
  processFiles(files)
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files || []) as File[]
  processFiles(files)
}

const processFiles = (files: File[]) => {
  const validFiles = files.filter(f => f.size < 5 * 1024 * 1024 && f.type.startsWith('image/'))
  if (validFiles.length + selectedFiles.value.length > 5) {
    uiStore.notify('Max 5 images allowed', 'error')
    return
  }
  
  validFiles.forEach(f => {
    selectedFiles.value.push(f)
    previews.value.push(URL.createObjectURL(f))
  })
}

const removeImage = (idx: number) => {
  selectedFiles.value.splice(idx, 1)
  previews.value.splice(idx, 1)
}
</script>
