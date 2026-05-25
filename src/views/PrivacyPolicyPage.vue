<script setup>
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import ar from '../locales/ar.json'
import en from '../locales/en.json'

const { locale, t } = useI18n()

const messages = {
  ar,
  en,
}

const isArabic = computed(() => locale.value === 'ar')
const privacy = computed(() => messages[locale.value]?.privacy || messages.ar.privacy)
const sections = computed(() => privacy.value.sections || [])

const setDocumentLanguage = () => {
  document.documentElement.lang = locale.value
  document.documentElement.dir = isArabic.value ? 'rtl' : 'ltr'
}

const setLocale = (value) => {
  locale.value = value
  window.localStorage.setItem('khaleea-locale', value)
  setDocumentLanguage()
}

onMounted(setDocumentLanguage)
watch(locale, setDocumentLanguage)
</script>

<template>
  <main
    class="relative min-h-screen overflow-hidden bg-[linear-gradient(135deg,#1a1008_0%,#231F20_50%,#0d0d0d_100%)] pb-16 pt-[100px] text-white"
    :dir="isArabic ? 'rtl' : 'ltr'"
  >
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_20%,rgba(241,90,41,0.2)_0%,transparent_62%)]"></div>
    <div class="pointer-events-none absolute -right-[110px] top-[40px] h-[460px] w-[460px] rounded-full bg-brand-accent/15 blur-[80px]"></div>
    <div class="pointer-events-none absolute -bottom-[100px] -left-[80px] h-[340px] w-[340px] rounded-full bg-[#6b1900]/20 blur-[80px]"></div>

    <section class="relative mx-auto max-w-[920px] px-5 md:px-8">
      <div class="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
        <div :class="isArabic ? 'text-right' : 'text-left'">
          <div class="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-[13px] font-semibold text-brand-accent">
            <span class="inline-block h-[7px] w-[7px] rounded-full bg-brand-accent"></span>
            {{ t('privacy.title') }}
          </div>
          <h1 class="font-display text-4xl font-black leading-[1.35] md:text-5xl">{{ t('privacy.title') }}</h1>
          <p class="mt-3 text-sm font-bold text-white/45">{{ t('privacy.updatedAt') }}</p>
        </div>

        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1 backdrop-blur-xl">
          <span class="px-3 text-xs font-bold text-white/50">{{ t('privacy.languageLabel') }}</span>
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="locale === 'ar' ? 'bg-brand-accent text-white' : 'text-white/65 hover:text-white'"
            @click="setLocale('ar')"
          >
            {{ t('privacy.arabic') }}
          </button>
          <button
            type="button"
            class="rounded-full px-4 py-2 text-sm font-bold transition"
            :class="locale === 'en' ? 'bg-brand-accent text-white' : 'text-white/65 hover:text-white'"
            @click="setLocale('en')"
          >
            {{ t('privacy.english') }}
          </button>
        </div>
      </div>

      <article
        class="rounded-[12px] border border-white/10 bg-white/10 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-8"
        :class="isArabic ? 'text-right' : 'text-left'"
      >
        <p class="text-base leading-8 text-white/70">{{ t('privacy.intro') }}</p>

        <section
          v-for="section in sections"
          :key="section.title"
          class="mt-8 border-t border-white/10 pt-6"
        >
          <h2 class="text-xl font-black leading-8 text-brand-accent">{{ section.title }}</h2>
          <div class="mt-3 space-y-3 text-sm leading-7 text-white/70 md:text-base md:leading-8">
            <p v-for="paragraph in section.body" :key="paragraph">
              {{ paragraph }}
            </p>
          </div>
        </section>
      </article>
    </section>
  </main>
</template>
