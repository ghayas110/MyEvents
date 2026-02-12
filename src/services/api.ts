import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { secureStorage } from '@/utils/storage'
import { logger } from '@/utils/logger'

const BASE_URL = import.meta.env.VITE_AUTH_API_BASE
const MOCK_API_BASE = import.meta.env.VITE_EVENTS_API_BASE
const PUBLIC_KEY = import.meta.env.VITE_REQRES_PUBLIC_KEY

// 1. Admin API (x-api-key) for login/verify
export const adminApi: AxiosInstance = axios.create({
    baseURL: `${BASE_URL}/api`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': PUBLIC_KEY
    }
})

// 2. App API (Authorization: Bearer) for user data
export const appApi: AxiosInstance = axios.create({
    baseURL: `${BASE_URL}/app`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 3. Mock API for events and supplementary features
export const mockApi: AxiosInstance = axios.create({
    baseURL: MOCK_API_BASE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptor for App API to inject session token
appApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = secureStorage.getItem<string>('auth_token', true) // true = sessionStorage
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Shared Response Interceptor for Logging and Error Handling
const setupInterceptors = (instance: AxiosInstance, name: string) => {
    instance.interceptors.response.use(
        (response) => {
            logger.debug(`[${name}] ${response.status} ${response.config.url}`)
            return response
        },
        async (error) => {
            const { response } = error

            // Handle Rate Limiting (429)
            if (response?.status === 429) {
                const retryAfter = response.headers['retry-after'] || 120
                logger.warn(`[${name}] Rate limit exceeded. Retry after ${retryAfter}s`)
            }

            // Handle Unauthorized (401)
            if (response?.status === 401 && name === 'APP') {
                logger.error('[APP] Session expired or invalid')
                secureStorage.removeItem('auth_token', true)
                // We can't use window.location here easily if we want to be clean, 
                // but for a quick fix it works. Or we handle it in the store.
            }

            const errorMessage = response?.data?.message || error.message
            logger.error(`[${name}] Request failed:`, {
                status: response?.status,
                message: errorMessage,
                hint: response?.data?.hint
            })

            return Promise.reject(error)
        }
    )
}

setupInterceptors(adminApi, 'ADMIN')
setupInterceptors(appApi, 'APP')
setupInterceptors(mockApi, 'MOCK')

// Mapping for backward compatibility or shared use
export const authApi = adminApi
export const eventsApi = mockApi
