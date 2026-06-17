<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import MealDetailsPopup from '../components/MealDetailsPopup.vue'
import { getRestaurantMenu } from '../services/menuApi'
import { formatPrice, getMealBasePrice, groupMealsByCategory, isRestaurantOpenNow } from '../utils/menu'

const { t } = useI18n()
const route = useRoute()
const restaurant = ref(null)
const groupedMeals = ref({})
const loading = ref(true)
const errorMessage = ref('')
const selectedMeal = ref(null)
const selectedCategory = ref('')
const categorySliderRef = ref(null)
const categoryBarAnchorRef = ref(null)
const categoryBarFixed = ref(false)
const navHeight = 70
const categoryScrollOffset = 150

const categoryEntries = computed(() => Object.entries(groupedMeals.value))
const sectionCategoryEntries = computed(() => [...categoryEntries.value].reverse())
const restaurantIsOpen = computed(() => isRestaurantOpenNow(restaurant.value?.workingHours))

const handleImageError = (event) => {
  event.target.onerror = null
  event.target.src = '/logo.png'
}

const fetchMenu = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await getRestaurantMenu(route.params.id)
    restaurant.value = response.data
    const grouped = groupMealsByCategory(response.data?.meal || [])
    groupedMeals.value = grouped
    selectedCategory.value = sectionCategoryEntries.value[0]?.[0] || ''
    await nextTick()
    updateActiveCategory()
  } catch (error) {
    errorMessage.value = error?.userMessage || t('errors.restaurantMenuLoad')
  } finally {
    loading.value = false
  }
}

const openMealPopup = (meal) => {
  selectedMeal.value = meal
}

const closeMealPopup = () => {
  selectedMeal.value = null
}

const scrollCategorySlider = (direction) => {
  categorySliderRef.value?.scrollBy({
    left: direction * 220,
    behavior: 'smooth',
  })
}

const updateCategoryBarFixed = () => {
  if (!categoryBarAnchorRef.value) {
    categoryBarFixed.value = false
    return
  }

  categoryBarFixed.value = categoryBarAnchorRef.value.getBoundingClientRect().top <= navHeight
}

const scrollToCategory = (category) => {
  const section = document.getElementById(`category-${category}`)

  if (!section) {
    return
  }

  selectedCategory.value = category
  window.scrollTo({
    top: Math.max(window.scrollY + section.getBoundingClientRect().top - categoryScrollOffset, 0),
    behavior: 'smooth',
  })
}

const openInstalledAppFromQr = () => {
  if (route.query.openApp !== '1' || !route.params.id) {
    return
  }

  const restaurantId = encodeURIComponent(String(route.params.id))
  window.location.href = `meals://emenu/${restaurantId}`

  window.setTimeout(() => {
    const fallbackUrl = new URL(window.location.href)
    fallbackUrl.searchParams.delete('openApp')
    window.history.replaceState({}, '', `${fallbackUrl.pathname}${fallbackUrl.search}${fallbackUrl.hash}`)
  }, 1200)
}

const updateActiveCategory = () => {
  updateCategoryBarFixed()

  if (!sectionCategoryEntries.value.length) {
    return
  }

  const firstCategory = sectionCategoryEntries.value[0][0]
  const firstSection = document.getElementById(`category-${firstCategory}`)

  if (firstSection && firstSection.getBoundingClientRect().top > categoryScrollOffset) {
    selectedCategory.value = firstCategory
    categorySliderRef.value?.scrollTo({
      left: 0,
      behavior: 'smooth',
    })
    return
  }

  let activeCategory = firstCategory

  sectionCategoryEntries.value.forEach(([category]) => {
    const section = document.getElementById(`category-${category}`)

    if (section && section.getBoundingClientRect().top <= categoryScrollOffset) {
      activeCategory = category
    }
  })

  selectedCategory.value = activeCategory
}

onMounted(() => {
  openInstalledAppFromQr()
  fetchMenu()
  window.addEventListener('scroll', updateActiveCategory, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveCategory)
})
</script>

<template>
  <main class="relative min-h-screen overflow-x-clip bg-[linear-gradient(135deg,#1a1008_0%,#231F20_50%,#0d0d0d_100%)] pb-16 pt-[70px] text-white">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_18%,rgba(241,90,41,0.18)_0%,transparent_62%)]"></div>
    <div class="pointer-events-none absolute -bottom-[120px] -left-[80px] h-[340px] w-[340px] rounded-full bg-[#6b1900]/20 blur-[80px]"></div>

    <div v-if="loading" class="mx-auto max-w-[980px] px-5 py-10 md:px-8">
      <div class="h-[300px] animate-pulse rounded-[8px] border border-white/10 bg-white/10"></div>
      <div class="mt-5 grid gap-4 md:grid-cols-2">
        <div v-for="item in 4" :key="item" class="h-[140px] animate-pulse rounded-[8px] border border-white/10 bg-white/10"></div>
      </div>
    </div>

    <section v-else-if="errorMessage" class="relative mx-auto max-w-[980px] px-5 py-10 md:px-8">
      <div class="rounded-[8px] border border-red-300/30 bg-red-500/10 px-5 py-6 text-right text-red-100">
        {{ errorMessage }}
      </div>
    </section>

    <template v-else-if="restaurant">
      <section class="relative py-10 backdrop-blur-xl overflow-hidden bg-brand-primary/20">

        <div class="relative mx-auto flex max-w-[980px] flex-col justify-end px-5 pb-8 text-right text-white md:px-8">

          <div class="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div
                class="mb-3 inline-flex rounded-full px-3 py-1 text-xs font-extrabold"
                :class="restaurantIsOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              >
                {{ restaurantIsOpen ? t('restaurant.openNow') : t('restaurant.closedNow') }}
              </div>
              <div class="flex items-center justify-between gap-5">
                <div class="border-2 border-red-400 rounded-full p-1">
                  <img
                      :src="restaurant.image || '/logo.png'"
                      :alt="restaurant.name"
                      crossorigin="anonymous"
                      class="rounded-full h-20 w-20 object-cover"
                      @error="handleImageError"
                  />
                </div>
                <h1 class="font-display text-4xl font-black leading-[1.35] md:text-6xl">{{ restaurant.name }}</h1>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="rounded-[8px] bg-white/10 px-4 py-3 backdrop-blur">
                <div class="text-xs text-white/60">{{ t('restaurant.rating') }}</div>
                <div class="mt-1 font-extrabold">★ {{ restaurant.ratingsAverage || 1 }}</div>
              </div>
              <div class="rounded-[8px] bg-white/10 px-4 py-3 backdrop-blur">
                <div class="text-xs text-white/60">{{ t('restaurant.time') }}</div>
                <div class="mt-1 font-extrabold">{{ restaurant.deliveryTime || '15 - 25' }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref="categoryBarAnchorRef" class="h-16">
        <section
          class="border-y border-white/10 bg-brand-primary/55 shadow-[0_18px_45px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-shadow duration-200"
          :class="categoryBarFixed ? 'fixed inset-x-0 top-[70px] z-[190]' : 'relative z-40'"
        >
          <div class="mx-auto flex h-16 max-w-[980px] items-center gap-2 px-5 md:px-8">
            <button
              type="button"
              class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white transition hover:border-brand-accent hover:text-brand-accent sm:flex"
              :aria-label="t('restaurant.previousCategory')"
              @click="scrollCategorySlider(-1)"
            >
              <i class="fa-solid fa-angle-right"></i>
            </button>

            <div
              ref="categorySliderRef"
              class="flex flex-1 touch-pan-x snap-x snap-mandatory gap-2 overflow-x-auto overscroll-x-contain scroll-smooth [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <button
                v-for="[category] in sectionCategoryEntries"
                :key="category"
                type="button"
                class="shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-bold transition"
                :class="
                  selectedCategory === category
                    ? 'border-brand-accent bg-brand-accent text-white shadow-[0_10px_30px_rgba(241,90,41,0.28)]'
                    : 'border-white/15 bg-white/10 text-white hover:border-brand-accent hover:text-brand-accent'
                "
                @click="scrollToCategory(category)"
              >
                {{ category }}
              </button>
            </div>

            <button
              type="button"
              class="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white transition hover:border-brand-accent hover:text-brand-accent sm:flex"
              :aria-label="t('restaurant.nextCategory')"
              @click="scrollCategorySlider(1)"
            >
              <i class="fa-solid fa-angle-left"></i>
            </button>
          </div>
        </section>
      </div>

      <section class="relative mx-auto max-w-[980px] px-5 py-8 md:px-8">
        <div v-if="sectionCategoryEntries.length === 0" class="rounded-[8px] border border-white/10 bg-white/10 px-5 py-10 text-center shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <h2 class="text-xl font-extrabold">{{ t('restaurant.emptyMealsTitle') }}</h2>
          <p class="mt-2 text-sm text-white/55">{{ t('restaurant.emptyMealsDescription') }}</p>
        </div>

        <div v-else class="space-y-8">
          <section v-for="[category, meals] in sectionCategoryEntries" :id="`category-${category}`" :key="category" class="scroll-mt-36">
            <h2 class="mb-3 text-right text-2xl font-black">{{ category }}</h2>

            <div class="grid gap-3 md:grid-cols-2">
              <button
                v-for="meal in meals"
                :key="meal.id || meal._id"
                type="button"
                class="group flex min-h-[132px] w-full cursor-pointer gap-3 rounded-[8px] border border-white/10 bg-white/10 p-3 text-right text-white duration-100 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl transition"
                @click="openMealPopup(meal)"
              >
                <img
                  :src="meal.image || '/logo.png'"
                  :alt="meal.name"
                  crossorigin="anonymous"
                  class="h-[108px] w-[116px] shrink-0 rounded-[8px] object-cover"
                  loading="lazy"
                  @error="handleImageError"
                />

                <div class="flex min-w-0 flex-1 flex-col items-end justify-between">
                  <div class="w-full">
                    <h3 class="truncate text-lg font-extrabold transition group-hover:text-brand-accent">{{ meal.name }}</h3>
                    <p class="mt-1 max-h-11 overflow-hidden text-sm leading-6 text-white/55">{{ meal.description }}</p>
                  </div>
                  <div class="mt-3 text-base w-full font-black">
                    {{ formatPrice(getMealBasePrice(meal)) }}
                    <span class="text-brand-accent"> {{ t('common.currency') }} </span>
                  </div>
                </div>
              </button>
            </div>
          </section>
        </div>
      </section>
    </template>

    <MealDetailsPopup :meal="selectedMeal" @close="closeMealPopup" />
  </main>
</template>
