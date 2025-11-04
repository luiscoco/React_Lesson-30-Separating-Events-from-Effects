// Local polyfill for React's proposed `useEvent`.
// Returns a stable function that always calls the latest handler.
import { useRef, useEffect, useCallback } from 'react';

export default function useEvent(handler) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  }, [handler]);

  const stableFn = useCallback((...args) => {
    return ref.current?.(...args);
  }, []);

  return stableFn;
}
