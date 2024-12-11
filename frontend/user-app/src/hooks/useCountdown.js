import { useState, useEffect, useRef } from 'react'

export const useCountdown = (initialTime, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const timerRef = useRef(null)
  const onTimeUpRef = useRef(onTimeUp)

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  }, [onTimeUp])

  useEffect(() => {
    setTimeLeft(initialTime)
  }, [initialTime])

  useEffect(() => {
    if (timeLeft <= 0) {
      const executeTimeUp = async () => {
        try {
          await onTimeUpRef.current()
        } catch (error) {
          console.error('Error executing time up callback:', error)
        }
      }
      executeTimeUp()
      return
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          const executeTimeUp = async () => {
            try {
              await onTimeUpRef.current()
            } catch (error) {
              console.error('Error executing time up callback:', error)
            }
          }
          executeTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [timeLeft === initialTime])

  return timeLeft
} 