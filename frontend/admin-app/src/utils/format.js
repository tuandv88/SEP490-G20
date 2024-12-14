export function formatDateTime(dateString) {
  if (!dateString) return 'No date'

  const dateObj = new Date(dateString)

  const year = dateObj.getUTCFullYear()
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getUTCDate()).padStart(2, '0')
  const hours = String(dateObj.getUTCHours()).padStart(2, '0')
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, '0')

  return `${hours}:${minutes}-${day}/${month}/${year}`
}

export const localToUTC = (localTime) => {
  const date = new Date(localTime)
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
}

export function convertISOtoUTC(isoString) {
  // Tạo đối tượng Date từ chuỗi ISO
  const date = new Date(isoString)

  // Lấy các thành phần UTC
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  // Format các thành phần với padding số 0
  const monthStr = (month + 1).toString().padStart(2, '0')
  const dayStr = day.toString().padStart(2, '0')
  const hoursStr = hours.toString().padStart(2, '0')
  const minutesStr = minutes.toString().padStart(2, '0')
  const secondsStr = seconds.toString().padStart(2, '0')

  // Trả về chuỗi định dạng UTC
  return `${year}-${monthStr}-${dayStr}T${hoursStr}:${minutesStr}:${secondsStr}Z`
}

export function getPastAndCurrentDates() {
  const now = new Date()

  const pastDate = new Date(now)
  pastDate.setMonth(pastDate.getMonth() - 8)

  const encodeISODate = (date) => {
    const isoString = date.toISOString()
    const [datePart, timePart] = isoString.split('T')
    const [time] = timePart.split('.')
    const formattedTime = time.replace(/:/g, '%3A')
    return `${datePart}T${formattedTime}Z`
  }

  return {
    pastDate: encodeISODate(pastDate),
    currentDate: encodeISODate(now) // Thời gian hiện tại
  }
}


export const formatDateTimeToLocal = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};