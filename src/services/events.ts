import { eventsApi } from './api'

export interface Event {
    id: string
    title: string
    description: string
    date: string
    location: string
    city: string
    thumbnail: string
    images: string[]
    attendeeCount: number
    isFavorited: boolean
    organizer: string
    category: string
    lat?: number
    lng?: number
}

export const eventsService = {
    async getEvents(page: number, limit: number, category?: string, search?: string) {
        const params: any = { page, limit }
        if (category) params.category = category
        if (search) params.title = search

        // Note: mockapi.io supports filtering by field names
        const response = await eventsApi.get<Event[]>('/events', { params })
        return response.data
    },

    async getEventById(id: string) {
        const response = await eventsApi.get<Event>(`/events/${id}`)
        return response.data
    },

    async createEvent(event: Omit<Event, 'id'>) {
        const response = await eventsApi.post<Event>('/events', event)
        return response.data
    },

    async updateEvent(id: string, event: Partial<Event>) {
        const response = await eventsApi.put<Event>(`/events/${id}`, event)
        return response.data
    },

    async deleteEvent(id: string) {
        const response = await eventsApi.delete(`/events/${id}`)
        return response.data
    },

    async toggleFavorite(id: string, isFavorited: boolean) {
        return this.updateEvent(id, { isFavorited })
    },

    async registerForEvent(id: string) {
        const response = await eventsApi.post(`/events/${id}/register`)
        return response.data
    },

    async uploadImages(formData: FormData) {
        // Mocking the upload return as requested
        // In a real scenario, this would be mockapi.io or another endpoint
        // For now, let's keep it calling /upload as if it existed
        const response = await eventsApi.post<{ url: string }>('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return response.data
    },
}


