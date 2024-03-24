import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";

const PomodoroTimer = () => {
  const [pomodoroLength, setPomodoroLength] = useState(25); // Default to 25 minutes
  const [breakLength, setBreakLength] = useState(5); // Default to 5 minutes
  const [isPomodoro, setIsPomodoro] = useState(true); // Track if it's Pomodoro time or break time

  // Function to initialize or restart the timer
  const initializeTimer = (length: number) => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(
      newExpiryTimestamp.getSeconds() + length * 60,
    );
    return newExpiryTimestamp;
  };

  const expiryTimestamp = initializeTimer(pomodoroLength);

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => {
      setIsPomodoro(!isPomodoro); // Toggle between Pomodoro and break
    },
  });

  // Automatically start the break timer when the Pomodoro ends, and vice versa
  useEffect(() => {
    if (!isPomodoro) {
      restart(initializeTimer(breakLength), true); // Start break timer automatically
    } else {
      restart(initializeTimer(pomodoroLength), true); // Start Pomodoro timer automatically after break
    }
  }, [isPomodoro]);

  const handleStart = () => {
    restart(initializeTimer(isPomodoro ? pomodoroLength : breakLength), true);
  };

  const handleStop = () => {
    setIsPomodoro(true);
    restart(initializeTimer(pomodoroLength), false);
  };

  // adjust timer lengths
  const handlePomodoroLengthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newLength = Number.isNaN(+e.target.value) ? 25 : +e.target.value;
    setPomodoroLength(newLength);
    if (isPomodoro) restart(initializeTimer(newLength), false); // Update timer only if it's Pomodoro time
  };

  const handleBreakLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = e.target.valueAsNumber || 5;
    setBreakLength(newLength);
    if (!isPomodoro) restart(initializeTimer(newLength), false); // Update timer only if it's break time
  };

  return (
    <>
      <div>
        <h1>{isPomodoro ? "Keep working!" : "Take a break!"}</h1>
      </div>
      <form>
        <label>Pomodoro Length (minutes):</label>
        <input
          className="no-spinner"
          type="number"
          min={1}
          max={60}
          value={pomodoroLength}
          onChange={handlePomodoroLengthChange}
        />
        <label>Break Length (minutes):</label>
        <input
          className="no-spinner"
          type="number"
          min={1}
          max={60}
          value={breakLength}
          onChange={handleBreakLengthChange}
        />
      </form>
      <div>
        <span>{minutes}:</span>
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </>
  );
};

export default PomodoroTimer;
