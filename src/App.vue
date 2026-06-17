<script setup>
import { computed, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from './components/Navbar.vue'

const { t } = useI18n()

const navLinks = computed(() => [
  { to: { path: '/', hash: '#home' }, label: t('nav.home') },
  { to: { name: 'e-menu' }, label: t('nav.eMenu') },
  { to: { name: 'privacy-policy' }, label: t('nav.privacy') },
])

const qrPattern = ref([])
const isModalOpen = ref(false)
const isPlatformPickerOpen = ref(false)
const activePlatform = ref('ios')
const androidApkPath = '/Android-Play-Store-build.apk'
const iosAppStoreUrl = 'https://apps.apple.com/us/app/khaleea-%D8%AE%D9%84%D9%8A%D8%A9/id6766290009?l=ar'

const modalIcon = computed(() => (activePlatform.value === 'ios' ? 'iOS' : 'APK'))
const modalStore = computed(() =>
  activePlatform.value === 'ios' ? t('download.iosStore') : t('download.androidStore'),
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
  if (!platform) {
    isPlatformPickerOpen.value = true
    return
  }

  isPlatformPickerOpen.value = false

  if (platform === 'android') {
    downloadAndroidApp()
    return
  }

  window.location.href = iosAppStoreUrl
}
</script>

<template>
  <div class="overflow-hidden">
    <div
      v-if="isPlatformPickerOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      @click.self="isPlatformPickerOpen = false"
    >
      <div class="relative isolate w-full max-w-[390px] overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(145deg,#231F20_0%,#171210_100%)] p-6 text-white shadow-[0_30px_90px_rgba(0,0,0,0.55)] [clip-path:inset(0_round_28px)] sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-brand-accent/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-brand-accent/10 blur-3xl"></div>

        <div class="relative mb-6 text-right">
          <div class="mb-4 inline-flex rounded-full border border-brand-accent/25 bg-brand-accent/10 px-3 py-1 text-xs font-bold text-brand-accent">
            {{ t('nav.downloadApp') }}
          </div>
          <h3 class="text-[22px] font-extrabold text-white">{{ t('download.choosePlatform') }}</h3>
          <p class="mt-2 text-sm leading-6 text-white/55">{{ t('download.choosePlatformHint') }}</p>
        </div>

        <div class="relative space-y-3">
          <button
            type="button"
            class="flex w-full items-center justify-between rounded-2xl border border-brand-accent/50 bg-brand-accent px-4 py-4 text-white transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(241,90,41,0.35)]"
            @click="handleDownloadRequest('ios')"
          >
            <span class="text-right">
              <span class="block text-xs text-white/70">{{ t('download.downloadFrom') }}</span>
              <span class="block text-base font-extrabold">App Store</span>
            </span>
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-sm font-extrabold">iOS</span>
          </button>

          <button
            type="button"
            class="flex w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-white transition hover:-translate-y-0.5 hover:border-brand-accent/45 hover:bg-white/10"
            @click="handleDownloadRequest('android')"
          >
            <span class="text-right">
              <span class="block text-xs text-white/55">{{ t('download.downloadFrom') }}</span>
              <span class="block text-base font-extrabold">Android</span>
            </span>
            <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-xs font-extrabold text-brand-accent">APK</span>
          </button>
        </div>

        <button
          type="button"
          class="relative mt-5 w-full rounded-xl py-3 text-sm font-bold text-white/55 transition hover:bg-white/5 hover:text-white"
          @click="isPlatformPickerOpen = false"
        >
          {{ t('download.cancel') }}
        </button>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-md"
      @click.self="isModalOpen = false"
    >
      <div class="w-full max-w-[380px] rounded-[28px] bg-white px-9 py-10 text-center text-brand-primary shadow-2xl">
        <div class="mx-auto mb-4 flex h-[66px] w-[66px] items-center justify-center rounded-[20px] bg-brand-accent text-lg font-extrabold text-white">
          {{ modalIcon }}
        </div>
        <h3 class="text-[22px] font-extrabold">{{ t('download.scanTitle') }}</h3>
        <p class="mt-1 text-[13px] text-brand-secondary">{{ modalStore }}</p>
        <div class="mx-auto my-5 grid w-[164px] grid-cols-8 gap-[3px] rounded-[14px] border-[3px] border-brand-accent bg-[#f8f8f8] p-4">
          <div
            v-for="(cell, index) in qrPattern"
            :key="index"
            class="h-[14px] rounded-[2px]"
            :class="cell ? 'bg-brand-primary' : 'bg-transparent'"
          ></div>
        </div>
        <p class="mb-6 text-xs text-[#bbbbbb]">{{ t('download.cameraHint') }}</p>
        <button
          type="button"
          class="rounded-xl bg-brand-accent px-10 py-3 text-[15px] font-bold text-white"
          @click="isModalOpen = false"
        >
          {{ t('download.done') }}
        </button>
      </div>
    </div>

    <Navbar :nav-links="navLinks" @open-download="handleDownloadRequest" />

    <RouterView v-slot="{ Component }">
      <component :is="Component" :open-download-modal="handleDownloadRequest" />
    </RouterView>

    <footer class="relative overflow-hidden border-t border-white/10 bg-[linear-gradient(145deg,#171210_0%,#0d0d0d_100%)] text-white">
      <div class="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"></div>

      <div >
        <div class="relative mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 text-right md:flex-row-reverse md:items-center md:justify-between md:px-8 lg:px-10">
          <div class="">
            <p class="mb-3 text-right text-sm font-extrabold text-brand-accent">{{ t('footer.support') }}</p>
            <div class="grid gap-3 sm:grid-cols-2">
              <a
                  href="mailto:support@khaleeaapp.com"
                  class="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition hover:border-brand-accent/60 hover:bg-brand-accent/10"
              >
                <span class="block text-xs text-white/45">{{ t('footer.email') }}</span>
                <span class="mt-1 block font-bold text-white group-hover:text-brand-accent">support@khaleeaapp.com</span>
              </a>
              <a
                  href="tel:+9647777602666"
                  dir="ltr"
                  class="group rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right transition hover:border-brand-accent/60 hover:bg-brand-accent/10"
              >
                <span class="block text-xs text-white/45">{{ t('footer.phone') }}</span>
                <span class="mt-1 block font-bold text-white group-hover:text-brand-accent">+964 777 760 2666</span>
              </a>
            </div>
          </div>
          <div class="max-w-md">
            <div class="flex items-center gap-2">
              <img class="w-12" src="/logo.png" alt="Khaleea logo">
              <span class="text-3xl font-black leading-none">{{ t('brand.name') }}</span>
            </div>
            <p class="mt-3 text-sm leading-7 text-white/55">{{ t('footer.description') }}</p>
          </div>
        </div>
        <div class="w-full flex items-center pb-6 justify-center">
          <p class="mt-4 text-sm text-white/35">© {{ new Date().getFullYear() }} {{ t('brand.name') }}. {{ t('footer.rights') }}.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
