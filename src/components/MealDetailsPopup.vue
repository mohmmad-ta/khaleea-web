<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatPrice, getMealBasePrice, getMealOptions, getPositiveOptionPrice } from '../utils/menu'

const props = defineProps({
  meal: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close'])

const { t } = useI18n()

const mealOptions = computed(() => getMealOptions(props.meal))

const mealTags = computed(() =>
  Array.isArray(props.meal?.tags)
    ? props.meal.tags.filter((tag) => tag?.title?.trim() || Number(tag?.price || 0) !== 0)
    : [],
)

const mealNotes = computed(() =>
  Array.isArray(props.meal?.notes) ? props.meal.notes.filter((note) => note?.title?.trim()) : [],
)

const handleImageError = (event) => {
  event.target.onerror = null
  event.target.src = '/logo.png'
}

const closePopup = () => {
  emit('close')
}
</script>

<template>
  <div
    v-if="meal"
    class="fixed inset-0 z-[500] flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-md"
    @click.self="closePopup"
  >
    <section
      class="max-h-[calc(100vh-48px)] w-full max-w-[920px] overflow-y-auto rounded-[12px] border border-white/10 bg-[#1a1515] text-right text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
      dir="rtl"
    >
      <div class="grid p-8 md:grid-cols-[0.9fr_1.1fr]">
        <div class="relative min-h-[280px] bg-[#111] md:min-h-full">
          <img
            :src="meal.image || '/logo.png'"
            :alt="meal.name"
            crossorigin="anonymous"
            class="absolute inset-0 h-full rounded-2xl w-full object-cover"
            @error="handleImageError"
          />
        </div>

        <div class="p-5 md:p-6">
          <div class="mb-4 flex items-start justify-between gap-4">
            <div>
              <h2 class="font-display text-3xl font-black leading-[1.35]">{{ meal.name }}</h2>
              <p v-if="meal.description" class="mt-2 text-sm leading-7 text-white/55">
                {{ meal.description }}
              </p>
            </div>
            <button
              type="button"
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white transition hover:border-brand-accent hover:text-brand-accent"
              :aria-label="t('meal.close')"
              @click="closePopup"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>

          </div>

          <div class="border-y border-white/10 py-4 text-2xl font-black">
            <span class="text-brand-accent">{{ t('common.currency') }}</span>
            {{ formatPrice(getMealBasePrice(meal)) }}
          </div>

          <div v-if="mealOptions.length" class="mt-5">
            <h3 class="text-lg font-extrabold">{{ t('meal.options') }}</h3>
            <div class="mt-3 space-y-2">
              <div
                v-for="option in mealOptions"
                :key="option.id || option._id || option.title"
                class="flex flex-row-reverse items-center justify-between gap-3 rounded-[8px] border border-brand-accent/20 bg-brand-accent/10 px-4 py-3 text-right"
              >
                <span class="font-bold text-brand-accent">
                  {{ getPositiveOptionPrice(option) ? `${formatPrice(getPositiveOptionPrice(option))} ${t('common.currency')}` : t('meal.free') }}
                </span>
                <span>{{ option.title }}</span>
              </div>
            </div>
          </div>

          <div v-if="mealTags.length" class="mt-5">
            <h3 class="text-lg font-extrabold">{{ t('meal.extras') }}</h3>
            <div class="mt-3 space-y-2">
              <div
                v-for="tag in mealTags"
                :key="tag.id || tag._id || tag.title"
                class="flex items-center justify-between rounded-[8px] border border-white/10 bg-white/5 px-4 py-3"
              >
                <span>{{ tag.title }}</span>

                <span class="font-bold text-brand-accent">
                  {{ Number(tag.price || 0) ? `${formatPrice(tag.price)} ${t('common.currency')}` : t('meal.free') }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="mealNotes.length" class="mt-5">
            <h3 class="text-lg font-extrabold">{{ t('meal.notes') }}</h3>
            <div class="mt-3 flex flex-wrap justify-start gap-2">
              <span
                v-for="note in mealNotes"
                :key="note.id || note._id || note.title"
                class="rounded-full bg-brand-accent/10 px-3 py-1 text-sm font-bold text-white"
              >
                {{ note.title }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
