import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'

interface LocalStorageHookProps<T> {
  storedKey: string,
  defaultValue: T,
}

const useLocalStorage = <T>(
  storedKey: string,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] => {

  const readValue = () => {
    try {
      const getValue = localStorage.getItem(storedKey);
      if (getValue !== null) {
        return JSON.parse(getValue);
      }
      return defaultValue;
    } catch {
      return defaultValue;
    }
  }

  const [storedValue, setStoredValue] = useState<T>(readValue())

  useEffect(() => {
    const rawValue = typeof storedValue === 'string' ? storedValue : JSON.stringify(storedValue);
    localStorage.setItem(storedKey, rawValue);
  }, [storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage