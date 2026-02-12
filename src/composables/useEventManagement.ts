import { useEventsStore } from '@/store/events'
import { eventsService, type Event } from '@/services/events'
import { logger } from '@/utils/logger'

export const useEventManagement = () => {
    const eventsStore = useEventsStore()

    const uploadImages = async (files: File[]) => {
        const uploadedUrls: string[] = []

        for (const file of files) {
            const formData = new FormData()
            formData.append('file', file)

            try {
                // Now using the real service
                const response = await eventsService.uploadImages(formData)
                // In a real scenario, response.url would come from server
                // Since this is a mock, we'll use URL.createObjectURL for demo if server returns nothing
                uploadedUrls.push(response.url || URL.createObjectURL(file))
            } catch (e) {
                logger.error('Image upload failed', e)
            }
        }

        return uploadedUrls
    }

    const createEvent = async (eventData: Omit<Event, 'id'>) => {
        try {
            return await eventsStore.createEvent(eventData)
        } catch (e) {
            logger.error('Event creation failed', e)
            throw e
        }
    }

    return {
        uploadImages,
        createEvent
    }
}
