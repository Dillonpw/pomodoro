import React, { useState, useEffect } from "react";

const Timer: React.FC = () => {
  const [workTimer, setWorkTimer] = useState<number>(0);
  const [breakTimer, setBreakTimer] = useState<number>(0);
  const [isWorkTime, setIsWorkTime] = useState<boolean>(true); // To track whether it's work or break time
  const [isActive, setIsActive] = useState<boolean>(false); // To control the start and stop of the timer

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    // Function to decrement timer
    const countdown = (): void => {
      if (isWorkTime && workTimer > 0) {
        setWorkTimer((workTimer) => workTimer - 1);
      } else if (!isWorkTime && breakTimer > 0) {
        setBreakTimer((breakTimer) => breakTimer - 1);
      }

      // Switch between work and break timer
      if (isWorkTime && workTimer === 0) {
        setIsWorkTime(false);
      } else if (!isWorkTime && breakTimer === 0) {
        setIsWorkTime(true);
        setWorkTimer(initialWorkTime);
        setBreakTimer(initialBreakTime);
      }
    };

    if (isActive) {
      interval = setInterval(countdown, 1000);
    }

    return () => {
      if (interval) clearInterval(interval); // Cleanup interval on component unmount
    };
  }, [isActive, isWorkTime, workTimer, breakTimer]);

  // Handle the start button click
  const handleStart = (): void => {
    setIsActive(true);
  };

  return (
    <form
      onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}
    >
      <label htmlFor="work-timer">Work timer: </label>
      <input
        type="number"
        id="work-timer"
        name="work-timer"
        value={workTimer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setWorkTimer(Number(e.target.value))
        }
      />
      <label htmlFor="break-timer">Break timer: </label>
      <input
        type="number"
        id="break-timer"
        name="break-timer"
        value={breakTimer}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setBreakTimer(Number(e.target.value))
        }
      />
      <button type="button" onClick={handleStart}>
        Start
      </button>
    </form>
  );
};

export default Timer;
