import { useState, useEffect } from "react";

/**
 * A custom React hook that allows for easy access to a value stored in local storage.
 * @param {string} [key="key"] - The key to use for the local storage item.
 * @param {string} [initialValue=""] - The initial value to use if the key is not found in local storage.
 * @returns An array containing the current value and a function to update the value.
 */
export const useStorageString = (key = "key", initialValue = "") => {
  const initial = () => window.localStorage.getItem(key) || initialValue;
  const [value, setValue] = useState(initial);
  useEffect(() => window.localStorage.setItem(key, value), [value]);

  return [value, setValue];
};
