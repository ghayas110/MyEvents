import { mockApi } from './api'

export const authService = {
    async checkEmailAvailability(email: string) {
        const response = await mockApi.post<{ available: boolean }>('/check-email', { email })
        return response.data
    }
}
