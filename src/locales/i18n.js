import { createI18n } from 'vue-i18n'
import ar from './ar.json'
import en from './en.json'

const getInitialLocale = () => {
  if (typeof window === 'undefined') {
    return 'ar'
  }

  return window.localStorage.getItem('khaleea-locale') || 'ar'
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getInitialLocale(),
  fallbackLocale: 'ar',
  messages: {
    ar,
    en,
  },
})

export default i18n
