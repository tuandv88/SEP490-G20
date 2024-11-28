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

// Ví dụ sử dụng
const localDate = '2024-11-27T09:28:37' // Định dạng ISO 8601
const utcDate = convertLocalToUTC(localDate)
console.log(utcDate.toISOString()) // In ra ngày giờ UTC dưới dạng ISO 8601
