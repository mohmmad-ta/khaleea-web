import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better performance
const HomePage = () => import('../views/HomePage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: false },
    },
  ],
})


export default router
