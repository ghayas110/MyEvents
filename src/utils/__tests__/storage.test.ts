import { describe, it, expect, beforeEach, vi } from 'vitest'
import { secureStorage } from '@/utils/storage'

describe('secureStorage', () => {
    beforeEach(() => {
        localStorage.clear()
        vi.clearAllMocks()
    })

    it('should encrypt and store an item', () => {
        const data = { token: 'secret-token-123' }
        secureStorage.setItem('test_key', data)

        const stored = localStorage.getItem('test_key')
        expect(stored).not.toBeNull()
        expect(stored).not.toBe(JSON.stringify(data)) // Should be encrypted
    })

    it('should decrypt and retrieve an item', () => {
        const data = { user: 'testuser' }
        secureStorage.setItem('user_key', data)

        const retrieved = secureStorage.getItem<{ user: string }>('user_key')
        expect(retrieved).toEqual(data)
    })

    it('should return null if item does not exist', () => {
        const retrieved = secureStorage.getItem('non_existent')
        expect(retrieved).toBeNull()
    })

    it('should remove an item', () => {
        secureStorage.setItem('temp', 'value')
        secureStorage.removeItem('temp')
        expect(localStorage.getItem('temp')).toBeNull()
    })
})
