<script setup>
import heroPhoneReference from '../assets/hero-phone-reference.png'

defineProps({
  openDownloadModal: {
    type: Function,
    required: true,
  },
})

const heroChips = []

const heroStats = []
</script>

<template>
  <div>
    <section
      id="home"
      class="relative flex min-h-screen items-center overflow-hidden bg-[linear-gradient(135deg,#1a1008_0%,#231F20_50%,#0d0d0d_100%)] px-[5%] pb-20 pt-[110px]"
    >
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_68%_45%,rgba(241,90,41,0.2)_0%,transparent_65%)]"></div>
      <div class="pointer-events-none absolute -right-[90px] -top-[130px] h-[520px] w-[520px] rounded-full bg-brand-accent/15 blur-[80px]"></div>
      <div class="pointer-events-none absolute -bottom-[60px] -left-[80px] h-[320px] w-[320px] rounded-full bg-[#6b1900]/20 blur-[80px]"></div>

      <div class="relative mx-auto flex w-full max-w-[1200px] flex-wrap items-center gap-14">
        <div class="min-w-[300px] flex-1 text-right">
          <div class="anim-fade-up anim-delay-1 mb-6 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-4 py-1.5 text-[13px] font-semibold text-brand-accent">
            <span class="anim-pulse-dot inline-block h-[7px] w-[7px] rounded-full bg-brand-accent"></span>
            التوصيل متوفر في مدينة بعقوبة
          </div>

          <h1 class="anim-fade-up anim-delay-2 mb-6 font-display text-[clamp(40px,5.5vw,68px)] font-black leading-[1.4] text-white">
            اطلب
            <br />
            <span class="text-brand-accent">من أي مكان،</span>
            <br />
            في أي وقت.
          </h1>

          <p class="anim-fade-up anim-delay-3 mb-9 text-lg max-w-[460px] leading-[1.78] text-white/55">
            خلية هو تطبيق توصيل شامل للطعام ، وتجربة سهلة من الطلب حتى الاستلام.
          </p>


          <div class="anim-fade-up anim-delay-5 mb-11 flex flex-wrap gap-3.5">
            <button
              type="button"
              class="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/10 px-[22px] py-[13px] text-white transition hover:-translate-y-0.5 hover:border-brand-accent hover:bg-brand-accent hover:shadow-[0_16px_40px_rgba(241,90,41,0.4)]"
              @click="openDownloadModal('ios')"
            >
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[13px] font-extrabold">iOS</span>
              <span class="text-right">
                <span class="block text-sm opacity-60">تحميل من</span>
                <span class="block text-base font-extrabold">App Store</span>
              </span>
            </button>

            <button
              type="button"
              class="flex items-center gap-3.5 rounded-2xl border border-white/20 bg-white/10 px-[22px] py-[13px] text-white transition hover:-translate-y-0.5 hover:border-brand-accent hover:bg-brand-accent hover:shadow-[0_16px_40px_rgba(241,90,41,0.4)]"
              @click="openDownloadModal('android')"
            >
              <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-[13px] font-extrabold">APK</span>
              <span class="text-right">
                <span class="block text-sm opacity-60">تحميل من</span>
                <span class="block text-base font-extrabold">Google Play</span>
              </span>
            </button>
          </div>

        </div>

        <div class="anim-slide-in anim-delay-3 relative flex min-w-[280px] flex-1 items-center justify-center py-12 max-[600px]:hidden">
          <div class="anim-spin-slow absolute h-[340px] w-[340px] rounded-full border border-dashed border-brand-accent/20"></div>
          <div class="anim-spin-reverse absolute h-[450px] w-[450px] rounded-full border border-brand-accent/10"></div>

          <div class="anim-float-soft absolute right-1 top-3 z-10 flex items-center gap-2 rounded-[14px] bg-white px-[14px] py-[10px] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <div class="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#f4f4f4] text-[11px] font-extrabold text-brand-primary">
              TOP5
            </div>
            <div>
              <div class="text-xs font-bold text-brand-primary">الأكثر طلباً</div>
              <div class="text-[10px] text-brand-secondary">خصومات مميزة اليوم</div>
            </div>
          </div>

          <div class="anim-float-soft anim-delay-4 absolute -left-1 bottom-11 z-10 flex items-center gap-2 rounded-[14px] bg-white px-[14px] py-[10px] shadow-[0_16px_40px_rgba(0,0,0,0.28)]">
            <div class="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-[#fff3e0] text-[11px] font-extrabold text-brand-primary">
              10%
            </div>
            <div>
              <div class="text-xs font-bold text-brand-primary">عرض خاص</div>
              <div class="text-[10px] text-brand-secondary">على المطاعم القريبة</div>
            </div>
          </div>

          <div class="relative z-[3] w-[290px] overflow-hidden rounded-[44px] border-[3px] border-[#262626] bg-[#111] p-[10px] shadow-[0_50px_100px_rgba(0,0,0,0.7)]">
            <div class="overflow-hidden rounded-[34px] bg-[#111]">
              <img
                :src="heroPhoneReference"
                alt="معاينة التطبيق"
                class="block h-[595px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>


  </div>
</template>
