<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  navLinks: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['open-download'])

const mobileMenuOpen = ref(false)
const isScrolled = ref(false)

const updateScrollState = () => {
  isScrolled.value = window.scrollY > 10
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const navWrapperClass = computed(() => [
  'fixed inset-x-0 top-0 z-[200] transition-all duration-300',
  isScrolled.value
    ? 'backdrop-blur-xl bg-brand-primary/30'
    : 'backdrop-blur-lg bg-brand-primary/5',
])

const handleDownloadClick = () => {
  closeMobileMenu()
  emit('open-download', 'android')
}

onMounted(() => {
  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
})
</script>

<template>
  <header :class="navWrapperClass">
    <div class="mx-auto flex min-h-[70px] max-w-[1200px] items-center justify-between gap-6 px-5 md:px-8 lg:px-10">
      <RouterLink
        class="flex items-center text-white"
        :to="{ path: '/', hash: '#home' }"
        @click="closeMobileMenu"
      >
        <img class="w-14" src="/logo.png" alt="logo">
        <span class="text-4xl font-black leading-none">
          {{ t('brand.name') }}
        </span>
      </RouterLink>

      <nav class="hidden items-center gap-1 lg:flex">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="rounded-full px-4 py-2 text-sm font-bold text-white/75 transition hover:bg-white/10 hover:text-white"
          active-class="bg-white/10 text-white"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <button
          type="button"
          class="flex items-center gap-2 rounded-[11px] bg-brand-accent px-5 py-[9px] text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#d94e20] hover:shadow-[0_8px_24px_rgba(241,90,41,0.4)]"
          @click="handleDownloadClick"
        >
          <span>↓</span>
          {{ t('nav.downloadApp') }}
        </button>
      </div>

      <button
        type="button"
        class="text-[22px] text-white lg:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span v-if="mobileMenuOpen">×</span>
        <span v-else>☰</span>
      </button>
    </div>

    <div
      v-if="mobileMenuOpen"
      class=" px-6 py-4 lg:hidden"
    >
      <div class="flex flex-col gap-1">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="rounded-[8px] px-4 py-3 text-right text-sm font-bold text-white/85 transition hover:bg-white/10 hover:text-white"
          active-class="bg-white/10 text-white"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </RouterLink>

        <div class="mt-3 flex flex-col gap-2">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-[11px] bg-brand-accent px-5 py-[10px] text-[13px] font-bold text-white transition hover:bg-[#d94e20]"
            @click="handleDownloadClick"
          >
            <span>↓</span>
            {{ t('nav.downloadApp') }}
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
