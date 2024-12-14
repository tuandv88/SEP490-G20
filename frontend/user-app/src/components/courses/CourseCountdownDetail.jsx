import { useEffect, useState } from 'react'
import { Timer } from 'lucide-react'

export function CourseCountdownDetail({ scheduledDate, onCountdownEnd }) {
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
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      
      if (!newTimeLeft) {
        clearInterval(timer)
        onCountdownEnd?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [scheduledDate, onCountdownEnd])

  if (!timeLeft) return null

  return (
    <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 backdrop-blur-lg rounded-xl p-4 text-white mb-4 shadow-lg border border-white/10">
      <div className="flex items-center justify-center gap-2 mb-3">
        <Timer className="w-4 h-4 text-indigo-300" />
        <div className="text-sm font-medium text-indigo-200">Incomming in</div>
      </div>
      <div className="flex gap-4 justify-center">
        <TimeUnit value={timeLeft.days} unit="days" />
        <Separator />
        <TimeUnit value={timeLeft.hours} unit="hours" />
        <Separator />
        <TimeUnit value={timeLeft.minutes} unit="min" />
        <Separator />
        <TimeUnit value={timeLeft.seconds} unit="sec" />
      </div>
    </div>
  )
}

function TimeUnit({ value, unit }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold tabular-nums">
        {value.toString().padStart(2, '0')}
      </span>
      <span className="text-xs mt-1 text-indigo-200 font-medium">
        {unit}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <div className="flex items-center">
      <div className="w-1 h-1 rounded-full bg-indigo-400/50 mb-6"></div>
    </div>
  )
}