import { createI18n } from 'vue-i18n'
import ar from './ar.json'

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'ar',
  fallbackLocale: 'ar',
  messages: {
    ar,
  },
})

export default i18n
