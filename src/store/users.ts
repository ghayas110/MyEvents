import { defineStore } from 'pinia'
import { adminApi } from '@/services/api'
import { authService } from '@/services/auth'
import { logger } from '@/utils/logger'

export interface User {
    id: number
    email: string
    first_name: string
    last_name: string
    avatar: string
}

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [] as User[],
        isLoading: false,
        page: 1,
        totalPages: 0,
    }),

    actions: {
        async fetchUsers(page = 1) {
            this.isLoading = true
            try {
                const response = await adminApi.get(`/users?page=${page}`)
                const { data, total_pages } = response.data
                this.users = data
                this.totalPages = total_pages
                this.page = page
                logger.info(`Fetched ${data.length} users for page ${page}`)
            } catch (error) {
                logger.error('Failed to fetch users', error)
            } finally {
                this.isLoading = false
            }
        },

        async checkEmailAvailability(email: string) {
            try {
                const result = await authService.checkEmailAvailability(email)
                return result.available
            } catch (error) {
                logger.error('Failed to check email availability', error)
                return false
            }
        }
    }
})
