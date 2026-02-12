import { defineStore } from 'pinia'
import { eventsService, type Event } from '@/services/events'
import { logger } from '@/utils/logger'

interface EventsState {
    events: Event[]
    isLoading: boolean
    error: string | null
    page: number
    hasMore: boolean
    currentEvent: Event | null
}

export const useEventsStore = defineStore('events', {
    state: (): EventsState => ({
        events: [],
        isLoading: false,
        error: null,
        page: 1,
        hasMore: true,
        currentEvent: null,
    }),

    actions: {
        async fetchEvents(reset: boolean = false) {
            if (this.isLoading || (!this.hasMore && !reset)) return

            if (reset) {
                this.page = 1
                this.events = []
                this.hasMore = true
            }

            this.isLoading = true
            this.error = null

            try {
                const limit = 10
                const data = await eventsService.getEvents(this.page, limit)

                if (data.length < limit) {
                    this.hasMore = false
                }

                this.events = [...this.events, ...data]
                this.page++
            } catch (e: any) {
                this.error = 'Failed to fetch events'
                logger.error(this.error, e)
            } finally {
                this.isLoading = false
            }
        },

        async fetchEventById(id: string) {
            this.isLoading = true
            try {
                this.currentEvent = await eventsService.getEventById(id)
            } catch (e: any) {
                this.error = 'Failed to fetch event details'
                logger.error(this.error, e)
            } finally {
                this.isLoading = false
            }
        },

        async toggleFavorite(id: string) {
            const event = this.events.find(e => e.id === id)
            if (!event) return

            const newStatus = !event.isFavorited
            try {
                await eventsService.toggleFavorite(id, newStatus)
                event.isFavorited = newStatus
                if (this.currentEvent?.id === id) {
                    this.currentEvent.isFavorited = newStatus
                }
            } catch (e) {
                logger.error('Failed to toggle favorite', e)
            }
        },

        async registerForEvent(id: string) {
            this.isLoading = true
            try {
                await eventsService.registerForEvent(id)
                const event = this.events.find(e => e.id === id)
                if (event) {
                    event.attendeeCount++
                }
                if (this.currentEvent?.id === id) {
                    this.currentEvent.attendeeCount++
                }
            } catch (e: any) {
                this.error = 'Failed to register for event'
                logger.error(this.error, e)
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async createEvent(eventData: Omit<Event, 'id'>) {
            this.isLoading = true
            try {
                const newEvent = await eventsService.createEvent(eventData)
                this.events.unshift(newEvent)
                return newEvent
            } catch (e: any) {
                this.error = 'Failed to create event'
                logger.error(this.error, e)
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async updateEvent(id: string, eventData: Partial<Event>) {
            this.isLoading = true
            try {
                const updatedEvent = await eventsService.updateEvent(id, eventData)
                const index = this.events.findIndex(e => e.id === id)
                if (index !== -1) {
                    this.events[index] = { ...this.events[index], ...updatedEvent }
                }
                if (this.currentEvent?.id === id) {
                    this.currentEvent = { ...this.currentEvent, ...updatedEvent }
                }
                return updatedEvent
            } catch (e: any) {
                this.error = 'Failed to update event'
                logger.error(this.error, e)
                throw e
            } finally {
                this.isLoading = false
            }
        },

        async deleteEvent(id: string) {
            this.isLoading = true
            try {
                await eventsService.deleteEvent(id)
                this.events = this.events.filter(e => e.id !== id)
                if (this.currentEvent?.id === id) {
                    this.currentEvent = null
                }
            } catch (e: any) {
                this.error = 'Failed to delete event'
                logger.error(this.error, e)
                throw e
            } finally {
                this.isLoading = false
            }
        },
    },
})
