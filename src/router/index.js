import { createRouter, createWebHistory } from 'vue-router'

const PUBLIC_SITE_URL = 'https://khaleeaapp.com'
const defaultKeywords = 'خلية, تطبيق خلية, توصيل طعام, توصيل مطاعم, مطاعم بعقوبة, توصيل بعقوبة, قائمة إلكترونية, khaleea, food delivery, restaurants in Baqubah, e-menu'

const seoByRoute = {
  home: {
    title: 'خلية | توصيل الطعام والمطاعم في بعقوبة - Khaleea',
    description: 'خلية تطبيق توصيل الطعام في بعقوبة. تصفح المطاعم والقوائم الإلكترونية واطلب وجبتك بسهولة. Khaleea food delivery and restaurant menus.',
    keywords: defaultKeywords,
    canonicalPath: '/',
  },
  'e-menu': {
    title: 'القائمة الإلكترونية للمطاعم | خلية - Khaleea E-Menu',
    description: 'تصفح القوائم الإلكترونية للمطاعم المتاحة على خلية واختر وجبتك من مطاعم بعقوبة.',
    keywords: `${defaultKeywords}, منيو مطاعم, قوائم المطاعم, restaurant menu`,
    canonicalPath: '/e-menu',
  },
  'e-menu-restaurant': {
    title: 'منيو المطعم | خلية - Khaleea',
    description: 'شاهد وجبات وأسعار المطعم في القائمة الإلكترونية لتطبيق خلية.',
    keywords: `${defaultKeywords}, منيو مطعم, وجبات مطاعم`,
  },
  'privacy-policy': {
    title: 'سياسة الخصوصية | خلية - Khaleea',
    description: 'تعرف على سياسة خصوصية تطبيق خلية وكيفية التعامل مع بيانات المستخدمين.',
    keywords: 'خلية, Khaleea, سياسة الخصوصية, privacy policy',
    canonicalPath: '/privacy-policy',
  },
}

const setMetaContent = (selector, content) => {
  const element = document.head.querySelector(selector)

  if (element) {
    element.setAttribute('content', content)
  }
}

const setCanonicalUrl = (path) => {
  const canonical = document.head.querySelector('link[rel="canonical"]')
  const url = `${PUBLIC_SITE_URL}${path === '/' ? '/' : path}`

  canonical?.setAttribute('href', url)
  setMetaContent('meta[property="og:url"]', url)
}

// Lazy load views for better performance
const HomePage = () => import('../views/HomePage.vue')
const EMenuPage = () => import('../views/EMenuPage.vue')
const PrivacyPolicyPage = () => import('../views/PrivacyPolicyPage.vue')
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
      path: '/privacy-policy',
      alias: '/privacyPolicy',
      name: 'privacy-policy',
      component: PrivacyPolicyPage,
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

router.afterEach((to) => {
  const seo = seoByRoute[to.name] || seoByRoute.home

  document.title = seo.title
  setMetaContent('meta[name="description"]', seo.description)
  setMetaContent('meta[name="keywords"]', seo.keywords)
  setMetaContent('meta[property="og:title"]', seo.title)
  setMetaContent('meta[property="og:description"]', seo.description)
  setMetaContent('meta[name="twitter:title"]', seo.title)
  setMetaContent('meta[name="twitter:description"]', seo.description)
  setCanonicalUrl(seo.canonicalPath || to.path)
})

export default router
