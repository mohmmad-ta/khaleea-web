import api from './api'

export const getRestaurants = async ({ page = 1, limit = 30, query = '' } = {}) => {
  const endpoint = query.trim() ? '/meal/search' : '/meal'
  const params = query.trim()
    ? { q: query.trim(), page, limit }
    : { page, limit, sort: '-ratingsAverage' }

  const response = await api.get(endpoint, { params })
  return response.data
}

export const getRestaurantMenu = async (restaurantId) => {
  const response = await api.get(`/meal/${restaurantId}`)
  return response.data
}

export const getMeal = async (mealId) => {
  const response = await api.get(`/meal/getMeal/${mealId}`)
  return response.data
}
