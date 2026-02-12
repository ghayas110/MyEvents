import { defineStore } from 'pinia'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}

export const useUIStore = defineStore('ui', {
    state: () => ({
        toasts: [] as Toast[],
    }),

    actions: {
        notify(message: string, type: 'success' | 'error' | 'info' = 'info') {
            const id = Date.now().toString()
            this.toasts.push({ id, message, type })

            setTimeout(() => {
                this.removeToast(id)
            }, 5000)
        },

        removeToast(id: string) {
            this.toasts = this.toasts.filter(t => t.id !== id)
        },
    },
})
