import { useEffect, useState } from 'react'

export function CourseCountdown({ scheduledDate }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  function calculateTimeLeft() {
    const difference = new Date(scheduledDate) - new Date()
    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      }
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

  const timeUnits = [
    { label: 'Day', value: timeLeft.days },
    { label: 'Hour', value: timeLeft.hours },
    { label: 'Minute', value: timeLeft.minutes },
    { label: 'Second', value: timeLeft.seconds }
  ]

  return (
    <div className="flex gap-3 justify-center">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex flex-col items-center">
          <div className="text-2xl font-bold text-white">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="text-xs text-white/80 font-medium">
            {unit.label}
          </div>
          {index < timeUnits.length - 1 && (
            <div className="text-white text-xl font-bold absolute top-1/2 -translate-y-1/2 -right-2">
              :
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 