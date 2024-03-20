import React from 'react';
import { useTimer } from 'react-timer-hook';

const PomodoroTimer = () => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + 1 * 60); // 25 minutes from now

  const {
    seconds,
    minutes,
    start,
    pause,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => alert('Time is up!'),
  });

  // Restart timer function to reset it to 25 minutes
  const restartTimer = () => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + 1 * 60);
    restart(newExpiryTimestamp);
  };

  React.useEffect(() => {
    start();
    // Component will unmount logic handled internally by useTimer
  }, [start]);

  return (
    <div>
      <h1>Pomodoro Timer</h1>
      <div>
        <span>{minutes}</span>:<span>{seconds < 10 ? `0${seconds}` : seconds}</span>
      </div>
      <button onClick={pause}>Pause</button>
      <button onClick={start}>Start</button>
      <button onClick={restartTimer}>Restart</button>
    </div>
  );
};

export default PomodoroTimer;
