import { SetStateAction, useEffect, useState } from "react";

export default function usePersistantState<T>(
  key: string,
  initialValue: T,
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(initialValue);

  useEffect(() => {
    const value = localStorage.getItem(key);

    if (!value) return;

    console.log({ value });

    setState(JSON.parse(value));
  }, [key]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [state]);

  return [state, setState];
}
