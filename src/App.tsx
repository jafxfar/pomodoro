import React, { useState, useEffect, useRef } from 'react'
import { Timer } from './components/Timer/Timer'
import { ITimer } from './models/ITimer'
import type { Actions } from './types/Actions'

const types = ["Focus", "Short Break", "Long Break"]

function App() {
  const [timer, setTimer] = useState<ITimer>(new ITimer(0, 0, 1500, false))
  const [currentTime, setCurrentTime] = useState<Actions>("Focus")
  const [tick, setTick] = useState<number>(0)
  const [started, setStarted] = useState<boolean>(false)
  const [workSessions, setWorkSessions] = useState<number>(0)
  const sessionCounted = useRef<boolean>(false)
  const handleStart = () => {
    sessionCounted.current = false
    let duration = 10
    if (timer.startTime === 0) {
      if (currentTime === "Short Break") {
        duration = 300
      } else if (currentTime === "Long Break") {
        duration = 900
      }
    }
    const t = new ITimer(0, 0, duration, false)
    t.start()
    setTimer(t)
    setStarted(true)
  }
  const handleStop = () => {
    const t = new ITimer(timer.startTime, timer.endTime, timer.duration, timer.isRunning)
    t.stop()
    setTimer(t)
  }
  const handleReset = () => {
    sessionCounted.current = false
    const t = new ITimer(timer.startTime, timer.endTime, 1500, false)
    t.reset()
    setTimer(t)
  }
  const handleAddTime = (seconds: number) => {
    const t = new ITimer(timer.startTime, timer.endTime, timer.duration, timer.isRunning)
    t.addTime(seconds)
    setTimer(t)
  }

  useEffect(() => {
    sessionCounted.current = false
    let duration = 1500
    if (currentTime === "Short Break") {
      duration = 300
    } else if (currentTime === "Long Break") {
      duration = 900
    }
    setTimer(new ITimer(0, 0, duration, false))
  }, [currentTime])

  useEffect(() => {
    if (!timer.isRunning) return
    const interval = setInterval(() => {
      setTimer(prev => {
        if (!prev.isRunning) return prev
        const remaining = Math.max(0, Math.floor((prev.endTime - Date.now()) / 1000))
        if (remaining === 0 && prev.duration > 0 && !sessionCounted.current) {
          if (currentTime === "Focus") {
            setWorkSessions(ws => ws + 1)
          }
          sessionCounted.current = true
          const stopped = new ITimer(0, 0, 0, false)
          stopped.reset()
          return stopped
        }
        return new ITimer(prev.startTime, prev.endTime, remaining, true)
      })
      setTick(t => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer.isRunning, currentTime])
  return (
    <>
      <div className="container">
        {types.map((type, index) => (
          <button
            key={index}
            className={currentTime === type ? 'type-button active' : 'type-button'}
            onClick={() => setCurrentTime(type as Actions)}
          >
            {type}
          </button>
        ))}
      </div>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <strong>Work sessions completed: {workSessions}</strong>
      </div>
      <Timer
        isStarted={started}
        timer={timer}
        onStart={handleStart}
        onStop={handleStop}
        onReset={handleReset}
        onResume={() => {
          const t = new ITimer(timer.startTime, timer.endTime, timer.duration, false)
          t.resume()
          setTimer(t)
        }}
        onAddTime={handleAddTime}
      />
    </>
  )
}

export default App