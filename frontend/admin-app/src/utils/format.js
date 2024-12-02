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

export function convertLocalToUTC(localDate) {
  // Tạo một đối tượng Date từ ngày giờ địa phương
  const date = new Date(localDate)

  // Lấy các thành phần của ngày giờ UTC
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() // Lưu ý: Tháng trong JavaScript bắt đầu từ 0
  const day = date.getUTCDate()
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()

  // Tạo một đối tượng Date mới với các thành phần UTC
  const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds))

  return utcDate
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
