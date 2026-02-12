import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET || 'fallback-secret'

export const secureStorage = {
    setItem(key: string, value: any, useSession = false): void {
        const storage = useSession ? window.sessionStorage : window.localStorage
        const jsonValue = JSON.stringify(value)
        const encrypted = CryptoJS.AES.encrypt(jsonValue, SECRET_KEY).toString()
        storage.setItem(key, encrypted)
    },

    getItem<T>(key: string, useSession = false): T | null {
        const storage = useSession ? window.sessionStorage : window.localStorage
        const encrypted = storage.getItem(key)
        if (!encrypted) return null

        try {
            const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY)
            const decrypted = bytes.toString(CryptoJS.enc.Utf8)
            if (!decrypted) return null
            return JSON.parse(decrypted) as T
        } catch (e) {
            console.error('Error decrypting storage item:', e)
            return null
        }
    },

    removeItem(key: string, useSession = false): void {
        const storage = useSession ? window.sessionStorage : window.localStorage
        storage.removeItem(key)
    },

    clear(useSession = false): void {
        const storage = useSession ? window.sessionStorage : window.localStorage
        storage.clear()
    },
}
