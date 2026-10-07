'use client';

import { useCallback, useEffect, useState } from 'react';

const useThrottle = <T extends (...args: never[]) => void>(
  callback: T,
  delay: number,
) => {
  const [isReady, setIsReady] = useState(true);

  const debounce = useCallback(
    (...args: Parameters<T>) => {
      if (!isReady) return;

      setIsReady(false);
      callback(...args);
    },
    [callback, isReady],
  );

  useEffect(() => {
    if (!isReady) {
      const timer = setTimeout(() => setIsReady(true), delay);

      return () => clearTimeout(timer);
    }
  }, [isReady, delay]);

  return debounce;
};

export default useThrottle;
