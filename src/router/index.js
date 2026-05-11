import { createRouter, createWebHistory } from 'vue-router'

// Lazy load views for better performance
const HomePage = () => import('../views/HomePage.vue')
const EMenuPage = () => import('../views/EMenuPage.vue')
const RestaurantMenuPage = () => import('../views/RestaurantMenuPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { requiresAuth: false },
    },
    {
      path: '/e-menu',
      name: 'e-menu',
      component: EMenuPage,
      meta: { requiresAuth: false },
    },
    {
      path: '/e-menu/:id',
      name: 'e-menu-restaurant',
      component: RestaurantMenuPage,
      meta: { requiresAuth: false },
    },
  ],
})


export default router
