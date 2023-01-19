import { useState, useEffect } from "react";

export const useStorageString = (key = "key", initialValue = "") => {
  const initial = () => window.localStorage.getItem(key) || initialValue;
  const [value, setValue] = useState(initial);
  useEffect(
    () => window.localStorage.setItem(key, value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value]
  );

  return [value, setValue];
};
