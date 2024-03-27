import { useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";

const PomodoroTimer = () => {
  const [pomodoroLength, setPomodoroLength] = useState(25); // Default to 25 minutes
  const [breakLength, setBreakLength] = useState(5); // Default to 5 minutes
  const [isPomodoro, setIsPomodoro] = useState(true); // Track if it's Pomodoro time or break time
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Track if the timer is active

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

  // Adjust timer lengths
  const handlePomodoroLengthChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newLength = Number.isNaN(+e.target.value) ? 25 : +e.target.value;
    setPomodoroLength(newLength);
    if (isPomodoro) restart(initializeTimer(newLength), false);
  };

  const handleBreakLengthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLength = e.target.valueAsNumber || 5;
    setBreakLength(newLength);
    if (!isPomodoro) restart(initializeTimer(newLength), false);
  };

  return (
    <main className="flex flex-col">
      <div>
        <h1
          className={`m-8 text-center text-4xl font-bold ${isPomodoro ? "text-blue-900" : "text-red-500"}`}
        >
          {!isTimerRunning
            ? "Ready to Go?"
            : isPomodoro
              ? "Keep Working"
              : "Break Time"}
        </h1>
      </div>

      <div className="m-4 flex justify-center text-4xl font-bold">
        <span>{minutes}:</span>
        <span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <div className="flex justify-center text-black">
        <button
          className="w-18 m-2 rounded-xl border-2 border-solid border-black bg-blue-400 px-4 py-1 text-white hover:scale-105"
          onClick={handleStart}
        >
          Start
        </button>
        <button
          className="w-18 m-2 rounded-xl border-2 border-solid border-black bg-red-500 px-4 py-1 text-white hover:scale-105"
          onClick={handleStop}
        >
          Reset
        </button>
      </div>
      <form className={`mt-10 grid grid-cols-2 place-items-center ${isTimerRunning ? 'hidden' : 'grid'}`}>
        <div className="grid grid-cols-1 place-items-center">
          <label>Work Length:</label>
          <p className="text-xs">minutes</p>
          <input
            className="m-1 w-14 rounded-lg border-2 border-black px-2 text-center text-black outline-none no-spinner hover:bg-gray-100 focus:cursor-text"
            type="number"
            min={1}
            max={60}
            value={pomodoroLength}
            onChange={handlePomodoroLengthChange}
            disabled={isTimerRunning}
          />
        </div>
        <div className="grid grid-cols-1 place-items-center">
          <label>Break Length:</label>
          <p className="text-xs">minutes</p>
          <input
            className="m-1 w-14 rounded-lg border-2 border-black px-2 text-center text-black outline-none no-spinner hover:bg-gray-100 focus:cursor-text"
            type="number"
            min={1}
            max={60}
            value={breakLength}
            onChange={handleBreakLengthChange}
            disabled={isTimerRunning}
          />
        </div>
      </form>
    </main>
  );
};

export default PomodoroTimer;
