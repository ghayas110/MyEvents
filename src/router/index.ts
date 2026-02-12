import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@views/HomeView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@views/LoginView.vue'),
            meta: { guestOnly: true }
        },
        {
            path: '/event/:id',
            name: 'event-details',
            component: () => import('@views/EventDetailsView.vue'),
            meta: { requiresAuth: true }
        },
        {
            path: '/create-event',
            name: 'create-event',
            component: () => import('@views/CreateEventView.vue'),
            meta: { requiresAuth: true }
        },
    ],
})

router.beforeEach((to, _, next) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login')
    } else if (to.meta.guestOnly && authStore.isAuthenticated) {
        next('/')
    } else {
        next()
    }
})

export default router
