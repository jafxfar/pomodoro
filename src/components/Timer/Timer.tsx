import React from "react";
import { ITimer } from "../../models/ITimer";
import "./timer.css";

interface TimerProps {
    isStarted: boolean;
    timer: ITimer;
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    onResume: () => void;
    onAddTime: (seconds: number) => void;
}

export const Timer: React.FC<TimerProps> = ({
    isStarted,
    timer,
    onStart,
    onStop,
    onReset,
    onResume,
    onAddTime
}) => {
    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const showStart = !isStarted && !timer.isRunning;
    const showResume = isStarted && !timer.isRunning && timer.duration !== 0;
    const showStopReset = isStarted && timer.isRunning && timer.duration !== 0;
    const showReset = timer.isRunning && timer.duration === 0;
    
    return (
        <div className="timer">
            <h1>{formatTime(timer.duration)}</h1>

            <div className="add-time-controls">
                {[{ label: "+ 25 min", sec: 1500 }, { label: "+ 15 min", sec: 900 }, { label: "+ 5 min", sec: 300 }, { label: "+1 min", sec: 60 }]
                    .map(({ label, sec }) => (
                        <div key={sec} onClick={() => onAddTime(sec)}>{label}</div>
                    ))}
            </div>

            <div className="timer-controls">
                {showStart && <button onClick={onStart}>Start</button>}
                {showResume && <button onClick={onResume}>Resume</button>}
                {showStopReset && (
                    <>
                        <button onClick={onStop}>Stop</button>
                        <button onClick={onReset}>Reset</button>
                    </>
                )}
                {showReset && <button onClick={onReset}>Reset</button>}
            </div>
        </div>
    );
}