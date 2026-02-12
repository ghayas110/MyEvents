import { defineStore } from 'pinia'
import { adminApi, appApi } from '@/services/api'
import { secureStorage } from '@/utils/storage'
import { logger } from '@/utils/logger'

export interface AuthUser {
    id: string
    email: string
    status: string
    first_name?: string
    last_name?: string
    avatar?: string
}

interface AuthState {
    user: AuthUser | null
    token: string | null
    isAuthenticated: boolean
    isVerifying: boolean // Step 2 state
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isVerifying: false,
    }),

    actions: {
        // Stage 1: Request Magic Link
        async requestLink(email: string) {
            try {
                await adminApi.post('/app-users/login', { email })
                this.isVerifying = true
                logger.info('Magic link requested for', email)
            } catch (error) {
                logger.error('Failed to request magic link', error)
                throw error
            }
        },

        // Stage 2: Verify Code
        async verifyCode(token: string) {
            try {
                const response = await adminApi.post('/app-users/verify', { token })
                const { session_token, email } = response.data.data

                this.token = session_token
                this.isAuthenticated = true
                this.isVerifying = false

                secureStorage.setItem('auth_token', session_token, true)
                await this.fetchProfile()

                logger.info('Auth successful for', email)
            } catch (error) {
                logger.error('Verification failed', error)
                throw error
            }
        },

        // Standard ReqRes Register
        async register(payload: any) {
            try {
                const response = await adminApi.post('/register', payload)
                const { token, id } = response.data
                this.token = token
                this.isAuthenticated = true
                secureStorage.setItem('auth_token', token, true)
                this.user = { id: id.toString(), email: payload.email, status: 'active' }
                logger.info('Registration successful for', payload.email)
            } catch (error) {
                logger.error('Registration failed', error)
                throw error
            }
        },

        // Standard ReqRes Login (Password based)
        async login(payload: any) {
            try {
                const response = await adminApi.post('/login', payload)
                const { token } = response.data
                this.token = token
                this.isAuthenticated = true
                secureStorage.setItem('auth_token', token, true)
                this.user = { id: 'reqres-id', email: payload.email, status: 'active' }
                logger.info('Standard login successful')
            } catch (error) {
                logger.error('Standard login failed', error)
                throw error
            }
        },

        async fetchProfile() {
            try {
                const response = await appApi.get('/me')
                this.user = response.data.data
                logger.info('Profile fetched', this.user)
            } catch (error) {
                this.logout()
                throw error
            }
        },

        async initAuth() {
            const token = secureStorage.getItem<string>('auth_token', true)
            if (token) {
                this.token = token
                this.isAuthenticated = true
                try {
                    await this.fetchProfile()
                } catch (e) {
                    this.logout()
                }
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false
            this.isVerifying = false
            secureStorage.removeItem('auth_token', true)
            logger.info('Logged out')
        }
    }
})
