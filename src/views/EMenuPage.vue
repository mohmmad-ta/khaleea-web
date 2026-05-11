<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getRestaurants } from '../services/menuApi'

const { t } = useI18n()

const restaurants = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const submittedQuery = ref('')

let searchTimer

const hasSearch = computed(() => submittedQuery.value.trim().length > 0)

const handleImageError = (event) => {
  event.target.onerror = null
  event.target.src = '/logo.png'
}

const fetchRestaurants = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getRestaurants({
      query: submittedQuery.value,
      limit: 40,
    })
    restaurants.value = response.data || []
  } catch (error) {
    errorMessage.value = error?.userMessage || t('errors.restaurantsLoad')
    restaurants.value = []
  } finally {
    loading.value = false
  }
}

const submitSearch = () => {
  window.clearTimeout(searchTimer)
  submittedQuery.value = searchQuery.value.trim()
  fetchRestaurants()
}

watch(searchQuery, (value) => {
  window.clearTimeout(searchTimer)
  searchTimer = window.setTimeout(() => {
    submittedQuery.value = value.trim()
    fetchRestaurants()
  }, 2000)
})

onMounted(fetchRestaurants)
</script>

<template>
  <main class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#1a1008_0%,#231F20_50%,#0d0d0d_100%)] pb-16 pt-[92px] text-white">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_20%,rgba(241,90,41,0.2)_0%,transparent_62%)]"></div>
    <div class="pointer-events-none absolute -right-[110px] top-[40px] h-[460px] w-[460px] rounded-full bg-brand-accent/15 blur-[80px]"></div>
    <div class="pointer-events-none absolute -bottom-[100px] -left-[80px] h-[340px] w-[340px] rounded-full bg-[#6b1900]/20 blur-[80px]"></div>

    <section class="relative mx-auto w-full max-w-[1180px] px-5 md:px-8">
      <div class="flex flex-col gap-6 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
        <div class="text-right">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-[13px] font-semibold text-brand-accent">
            <span class="inline-block h-[7px] w-[7px] rounded-full bg-brand-accent"></span>
            {{ t('eMenu.label') }}
          </div>
          <h1 class="font-display text-4xl font-black leading-[1.35] md:text-5xl">{{ t('eMenu.title') }}</h1>
          <p class="mt-3 max-w-[560px] text-base leading-7 text-white/55">
            {{ t('eMenu.description') }}
          </p>
        </div>

        <form class="w-full max-w-[420px]" @submit.prevent="submitSearch">
          <label class="sr-only" for="restaurant-search">{{ t('eMenu.searchLabel') }}</label>
          <div class="flex overflow-hidden rounded-[12px] border border-white/15 bg-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <input
              id="restaurant-search"
              v-model="searchQuery"
              type="search"
              class="min-w-0 flex-1 bg-transparent px-4 py-3 text-right text-sm text-white outline-none placeholder:text-white/45"
              :placeholder="t('eMenu.searchPlaceholder')"
            />
            <button
              type="submit"
              class="bg-brand-accent px-5 text-sm font-bold text-white transition hover:bg-[#d94e20]"
            >
              {{ t('eMenu.searchButton') }}
            </button>
          </div>
        </form>
      </div>

      <div v-if="loading" class="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in 6"
          :key="item"
          class="h-[220px] animate-pulse rounded-[8px] border border-white/10 bg-white/10"
        ></div>
      </div>

      <div v-else-if="errorMessage" class="mt-10 rounded-[8px] border border-red-300/30 bg-red-500/10 px-5 py-6 text-right text-red-100">
        {{ errorMessage }}
      </div>

      <div v-else-if="restaurants.length === 0" class="mt-10 rounded-[8px] border border-white/10 bg-white/10 px-5 py-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <h2 class="text-xl font-extrabold">{{ t('eMenu.emptyTitle') }}</h2>
        <p class="mt-2 text-sm text-white/55">
          {{ hasSearch ? t('eMenu.emptySearch') : t('eMenu.emptyRestaurants') }}
        </p>
      </div>

      <div v-else class="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="restaurant in restaurants"
          :key="restaurant.id || restaurant._id"
          :to="{ name: 'e-menu-restaurant', params: { id: restaurant.id || restaurant._id } }"
          dir="rtl"
          class="group overflow-hidden rounded-[8px] border border-white/10 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_40px_rgba(241,90,41,0.25)]"
        >
          <div class="relative h-[150px] overflow-hidden bg-[#111]">
            <img
              :src="restaurant.image || '/logo.png'"
              :alt="restaurant.name"
              crossorigin="anonymous"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              loading="lazy"
              @error="handleImageError"
            />
          </div>

          <div class="p-4 text-right">
            <div class="flex items-start justify-between gap-3">
              <h2 class="text-xl font-extrabold leading-8">{{ restaurant.name }}</h2>
              <span class="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-bold text-brand-accent">
                {{ restaurant.deliveryTime || '15 - 25' }} {{ t('eMenu.minute') }}
              </span>
            </div>
            <div class="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-sm text-white/55">
              <span>{{ t('eMenu.viewMenu') }}</span>
              <span class="font-bold text-white">★ {{ restaurant.ratingsAverage || 1 }}</span>
            </div>
          </div>
        </RouterLink>
      </div>
    </section>
  </main>
</template>
