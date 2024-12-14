export function formatTimeEstimation(minutes) {
  if (!minutes) return ''
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (hours === 0) {
    return `${remainingMinutes} min`
  } else if (remainingMinutes === 0) {
    return `${hours} hours`
  } else {
    return `${hours} hours ${remainingMinutes} min`
  }
}
