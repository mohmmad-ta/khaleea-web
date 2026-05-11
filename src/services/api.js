import axios from 'axios'
import ar from '../locales/ar.json'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7060/api/v1'
const APP_CLIENT_KEY = import.meta.env.VITE_APP_CLIENT_KEY
const PUBLIC_BASE_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '')

export const normalizeRemoteUri = (uri) => {
  const rawUri = String(uri || '').trim()

  if (!rawUri) {
    return rawUri
  }

  if (/^(data|blob|file):/i.test(rawUri)) {
    return rawUri
  }

  if (rawUri.startsWith('//')) {
    return `https:${rawUri}`
  }

  if (rawUri.startsWith('/')) {
    return `${PUBLIC_BASE_URL}${rawUri}`
  }

  if (rawUri.startsWith('public/')) {
    return `${PUBLIC_BASE_URL}/${rawUri}`
  }

  const replacedUri = rawUri
    .replace(/^http:\/\/localhost:7060/i, PUBLIC_BASE_URL)
    .replace(/^http:\/\/127\.0\.0\.1:7060/i, PUBLIC_BASE_URL)
    .replace(/^https?:\/\/localhost(?::\d+)?/i, PUBLIC_BASE_URL)
    .replace(/^https?:\/\/127\.0\.0\.1(?::\d+)?/i, PUBLIC_BASE_URL)

  try {
    const parsedUrl = new URL(replacedUri)
    const publicUrl = new URL(PUBLIC_BASE_URL)
    const isKhaleeaHost =
      parsedUrl.hostname === publicUrl.hostname ||
      parsedUrl.hostname === 'rest.napoltech.com' ||
      parsedUrl.hostname.endsWith('.napoltech.com')

    if (isKhaleeaHost && parsedUrl.protocol === 'http:') {
      parsedUrl.protocol = 'https:'
    }

    return parsedUrl.toString()
  } catch {
    return replacedUri
  }
}

const normalizeImageUrls = (value) => {
  if (Array.isArray(value)) {
    return value.map(normalizeImageUrls)
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        if (key === 'image' && typeof nestedValue === 'string' && nestedValue.trim()) {
          return [key, normalizeRemoteUri(nestedValue)]
        }

        return [key, normalizeImageUrls(nestedValue)]
      }),
    )
  }

  return value
}

export const getApiErrorMessage = (error) => {
  const backendMessage = error?.response?.data?.message

  if (typeof backendMessage === 'string' && backendMessage.trim()) {
    return backendMessage.trim()
  }

  if (error?.code === 'ECONNABORTED') {
    return ar.errors.timeout
  }

  if (!error?.response || error?.message === 'Network Error') {
    return ar.errors.network
  }

  return ar.errors.generic
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  if (APP_CLIENT_KEY) {
    config.headers['x-app-client-key'] = APP_CLIENT_KEY
  }

  return config
})

api.interceptors.response.use(
  (response) => {
    response.data = normalizeImageUrls(response.data)
    return response
  },
  (error) => {
    error.userMessage = getApiErrorMessage(error)
    return Promise.reject(error)
  },
)

export default api
