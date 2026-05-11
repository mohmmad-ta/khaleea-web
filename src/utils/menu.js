import ar from '../locales/ar.json'

export const formatPrice = (value) => {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('en-US').format(amount)
}

export const isRestaurantOpenNow = (workingHours) => {
  const open = workingHours?.open
  const close = workingHours?.close

  if (!open || !close) {
    return true
  }

  const [openHour, openMinute] = String(open).split(':').map(Number)
  const [closeHour, closeMinute] = String(close).split(':').map(Number)

  if ([openHour, openMinute, closeHour, closeMinute].some(Number.isNaN)) {
    return true
  }

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const openMinutes = openHour * 60 + openMinute
  const closeMinutes = closeHour * 60 + closeMinute

  if (openMinutes <= closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes
  }

  return currentMinutes >= openMinutes || currentMinutes <= closeMinutes
}

export const groupMealsByCategory = (meals = []) =>
  meals.reduce((groups, meal) => {
    const categoryName = meal?.category?.name || ar.common.fallbackCategory

    if (!groups[categoryName]) {
      groups[categoryName] = []
    }

    groups[categoryName].push(meal)
    return groups
  }, {})
