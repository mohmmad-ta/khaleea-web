<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

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
    ? 'bg-brand-primary/95 shadow-[0_4px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl'
    : 'bg-transparent',
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
          خلية
        </span>
      </RouterLink>

      <div class="hidden items-center gap-3 lg:flex">
        <button
          type="button"
          class="flex items-center gap-2 rounded-[11px] bg-brand-accent px-5 py-[9px] text-[13px] font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#d94e20] hover:shadow-[0_8px_24px_rgba(241,90,41,0.4)]"
          @click="handleDownloadClick"
        >
          <span>↓</span>
          تحميل التطبيق
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
      class="border-t border-white/10 bg-brand-primary/95 px-6 py-4 backdrop-blur-xl lg:hidden"
    >
      <div class="flex flex-col gap-1">

        <div class="mt-3 flex flex-col gap-2">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-[11px] bg-brand-accent px-5 py-[10px] text-[13px] font-bold text-white transition hover:bg-[#d94e20]"
            @click="handleDownloadClick"
          >
            <span>↓</span>
            تحميل التطبيق
          </button>
        </div>
      </div>
    </div>
  </header>
</template>
