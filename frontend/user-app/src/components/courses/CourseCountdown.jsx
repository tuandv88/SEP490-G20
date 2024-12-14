import { useEffect, useState } from 'react'

export function CourseCountdown({ scheduledDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(scheduledDate).getTime() - new Date().getTime()
    
    if (difference <= 0) {
      return null
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [scheduledDate])

  if (!timeLeft) return null

  return (
    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-2 text-white mb-4">
      <div className="text-sm font-medium mb-1">Incomming in</div>
      <div className="flex gap-2 text-sm justify-center">
        <TimeUnit value={timeLeft.days} unit="d" />
        <TimeUnit value={timeLeft.hours} unit="h" />
        <TimeUnit value={timeLeft.minutes} unit="m" />
        <TimeUnit value={timeLeft.seconds} unit="s" />
      </div>
    </div>
  )
}

function TimeUnit({ value, unit }) {
  return (
    <div className="flex items-center">
      <span className="font-bold">{value.toString().padStart(2, '0')}</span>
      <span className="text-xs ml-1 text-gray-300">{unit}</span>
    </div>
  )
} 