import { ScopeKey } from '../../../models/enum';
import React, { useEffect, useState } from 'react'

interface CountDownReturn {
  count: number,
  startCountdown: (startNumber: number) => void
  resetCountdown: () => void
}

const useCountDown = (): CountDownReturn => {
  const [count, setCount] = useState<number>(0);


  const startCountdown = (startNumber: number) => {
    setCount(startNumber);
  };

  const resetCountdown = () => {
    setCount(0);
    localStorage.removeItem(ScopeKey.COUNT_DOWN);
  };

  useEffect(() => {
    if (count > 0) {
      const timerId = setInterval(() => {
        setCount((prevCount) => prevCount - 1)
      }, 1000);
      return () => {
        clearInterval(timerId);
      };
    }
  }, [count]);

  useEffect(() => {
    localStorage.setItem(ScopeKey.COUNT_DOWN, count.toString());
  }, [count])


  useEffect(() => {
    const storedCountdown = localStorage.getItem(ScopeKey.COUNT_DOWN);
    if (storedCountdown !== null) {
      const parsedCountdown = parseInt(storedCountdown);
      if (!isNaN(parsedCountdown)) {
        setCount(parsedCountdown);
      }
    }
  }, []);

  return { count, startCountdown, resetCountdown }
}

export default useCountDown