import {  useEffect, useState } from "react"

export function usePersistentState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(defaultValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing storage", e);
      }
    }
    setIsHydrated(true);
  }, [key]);

  // Save to storage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state, isHydrated]);

  return [state, setState, isHydrated] as const;
}