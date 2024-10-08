import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { Button } from "./ui/button";
import useSound from "use-sound";

const PomodoroTimer = () => {
  const [pomodoroLength, setPomodoroLength] = useState(25); // Default to 25 minutes
  const [breakLength, setBreakLength] = useState(5); // Default to 5 minutes
  const [isPomodoro, setIsPomodoro] = useState(true); // Track if it's Pomodoro time or break time
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Track if the timer is active
  const [playSound] = useSound("/public/bell.mp3", { volume: 0.25 });

  // Function to initialize or restart the timer
  const initializeTimer = (length: number) => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(
      newExpiryTimestamp.getSeconds() + length * 60,
    );
    return newExpiryTimestamp;
  };

  const expiryTimestamp = initializeTimer(
    isPomodoro ? pomodoroLength : breakLength,
  );

  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => {
      playSound();
      setIsPomodoro(!isPomodoro); // Toggle between Pomodoro and break
      setIsTimerRunning(false); // Stop the timer when it expires
    },
  });

  // Automatically start the break timer when the Pomodoro ends, and vice versa
  useEffect(() => {
    restart(initializeTimer(isPomodoro ? pomodoroLength : breakLength), true);
    setIsTimerRunning(true); // Start the timer automatically
  }, [isPomodoro, restart]);

  const handleStart = () => {
    restart(initializeTimer(isPomodoro ? pomodoroLength : breakLength), true);
    setIsTimerRunning(true); // Indicate that the timer is running
  };

  const handleStop = () => {
    setIsPomodoro(true);
    restart(initializeTimer(pomodoroLength), false);
    setIsTimerRunning(false); // Indicate that the timer has stopped
  };

  const handlePomodoroLengthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newLength = Number.isNaN(+e.target.value) ? 25 : +e.target.value;
    setPomodoroLength(newLength);
    if (isPomodoro) restart(initializeTimer(newLength), false);
  };

  const handleBreakLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = Number.isNaN(+e.target.value) ? 5 : +e.target.value;
    setBreakLength(newLength);
    if (!isPomodoro) restart(initializeTimer(newLength), false);
  };

  return (
    <main className="flex flex-col">
      <div>
        <h1
          className={`m-8 text-center text-4xl font-bold ${isPomodoro ? "text-primary" : "text-destructive"}`}
        >
          {!isTimerRunning
            ? "Ready to Go?"
            : isPomodoro
              ? "Keep Working"
              : "Break Time"}
        </h1>
      </div>

      <div className="m-4 flex justify-center font-mono text-4xl font-bold">
        <span>{minutes}:</span>
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <div className="flex justify-center gap-4 text-black">
        <Button variant="default" onClick={handleStart}>
          Start
        </Button>
        <Button variant="destructive" onClick={handleStop}>
          Reset
        </Button>
      </div>
      <form
        className={`flex flex-row items-center justify-center gap-4 space-y-4 ${isTimerRunning ? "hidden" : ""}`}
      >
        <div className="mt-4 flex flex-col place-items-center font-mono">
          <label>Work Length:</label>
          <input
            className="m-1 w-14 rounded-lg border-2 border-black px-2 text-center text-black outline-none no-spinner focus:cursor-text"
            type="number"
            min={1}
            max={60}
            value={pomodoroLength}
            onChange={handlePomodoroLengthChange}
            disabled={isTimerRunning}
          />
          <p className="text-xs">minutes</p>
        </div>
        <div className="mt-4 flex flex-col place-items-center font-mono">
          <label>Break Length:</label>
          <input
            className="m-1 w-14 rounded-lg border-2 border-black px-2 text-center text-black outline-none no-spinner focus:cursor-text"
            type="number"
            min={1}
            max={60}
            value={breakLength}
            onChange={handleBreakLengthChange}
            disabled={isTimerRunning}
          />
          <p className="text-xs">minutes</p>
        </div>
      </form>
    </main>
  );
};

export default PomodoroTimer;
