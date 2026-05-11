<script setup>
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'

const navLinks = [
  { href: '#home', label: 'الرئيسية', icon: '•' },
  { href: '#features', label: 'المميزات', icon: '•' },
  { href: '#download', label: 'التحميل', icon: '•' },
]

const qrPattern = ref([])
const isModalOpen = ref(false)
const activePlatform = ref('ios')
const androidApkPath = '/Android-Play-Store-build.apk'

const modalIcon = computed(() => (activePlatform.value === 'ios' ? 'iOS' : 'APK'))
const modalStore = computed(() =>
  activePlatform.value === 'ios' ? 'App Store · iOS & iPadOS' : 'Google Play · Android',
)

const buildQrPattern = () => {
  const seed = Math.random()
  const corners = new Set()

  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      corners.add(row * 8 + column)
      corners.add(row * 8 + (7 - column))
      corners.add((7 - row) * 8 + column)
    }
  }

  qrPattern.value = Array.from({ length: 64 }, (_, index) => {
    return corners.has(index) || Math.sin(index * seed * 137.5) * 0.5 + 0.5 > 0.42
  })
}

const openDownloadModal = (platform) => {
  activePlatform.value = platform
  buildQrPattern()
  isModalOpen.value = true
}

const downloadAndroidApp = () => {
  const link = document.createElement('a')
  link.href = androidApkPath
  link.download = 'Android-Play-Store-build.apk'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleDownloadRequest = (platform) => {
  if (platform === 'android') {
    downloadAndroidApp()
    return
  }

  openDownloadModal('ios')
}
</script>

<template>
  <div class="overflow-hidden">
    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      @click.self="isModalOpen = false"
    >
      <div class="w-full max-w-[380px] rounded-[28px] bg-white px-9 py-10 text-center text-brand-primary shadow-2xl">
        <div class="mx-auto mb-4 flex h-[66px] w-[66px] items-center justify-center rounded-[20px] bg-brand-accent text-lg font-extrabold text-white">
          {{ modalIcon }}
        </div>
        <h3 class="text-[22px] font-extrabold">امسح الرمز لتحميل التطبيق</h3>
        <p class="mt-1 text-[13px] text-brand-secondary">{{ modalStore }}</p>
        <div class="mx-auto my-5 grid w-[164px] grid-cols-8 gap-[3px] rounded-[14px] border-[3px] border-brand-accent bg-[#f8f8f8] p-4">
          <div
            v-for="(cell, index) in qrPattern"
            :key="index"
            class="h-[14px] rounded-[2px]"
            :class="cell ? 'bg-brand-primary' : 'bg-transparent'"
          ></div>
        </div>
        <p class="mb-6 text-xs text-[#bbbbbb]">وجّه كاميرا الهاتف إلى الرمز في الأعلى</p>
        <button
          type="button"
          class="rounded-xl bg-brand-accent px-10 py-3 text-[15px] font-bold text-white"
          @click="isModalOpen = false"
        >
          تم
        </button>
      </div>
    </div>

    <Navbar :nav-links="navLinks" @open-download="handleDownloadRequest" />

    <RouterView v-slot="{ Component }">
      <component :is="Component" :open-download-modal="handleDownloadRequest" />
    </RouterView>
  </div>
</template>
