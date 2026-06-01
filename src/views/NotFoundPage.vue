<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="min-h-screen bg-brand-primary px-5 pb-20 pt-32 text-white">
    <section class="mx-auto flex max-w-3xl flex-col items-center rounded-[2rem] border border-white/10 bg-white/[0.06] px-6 py-14 text-center shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div class="mb-6 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-brand-accent text-3xl font-black text-white shadow-xl shadow-brand-accent/25">
        404
      </div>
      <p class="mb-3 text-sm font-bold text-brand-accent">{{ t('notFound.label') }}</p>
      <h1 class="text-3xl font-black md:text-5xl">{{ t('notFound.title') }}</h1>
      <p class="mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-base">
        {{ t('notFound.description') }}
      </p>
      <RouterLink
        to="/"
        class="mt-8 rounded-2xl bg-brand-accent px-8 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(241,90,41,0.35)]"
      >
        {{ t('notFound.backHome') }}
      </RouterLink>
    </section>
  </main>
</template>
