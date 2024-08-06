import { useState, useEffect } from "react";
import config from "./config";

export const useConditionalFetch = (url, shouldCache) => {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentTime = new Date().getTime();
        const cacheKey = `cache_${url}`;
        const timestampKey = `${cacheKey}_timestamp`;

        if (shouldCache) {
          const cachedData = localStorage.getItem(cacheKey);
          const cachedTimestamp = localStorage.getItem(timestampKey);

          if (cachedData && cachedTimestamp) {
            const cacheAge =
              currentTime - new Date(parseInt(cachedTimestamp)).getTime();
            if (cacheAge < config.cache_expiration_duration_milliseconds) {
              setState({
                loading: false,
                data: JSON.parse(cachedData),
                error: null,
              });
              return;
            } else {
              Object.keys(localStorage).forEach((key) => {
                if (key.startsWith("cache_")) {
                  localStorage.removeItem(key);
                }
              });
            }
          }
        }

        const response = await fetch(url);
        const data = await response.json();

        if (shouldCache) {
          localStorage.setItem(cacheKey, JSON.stringify(data));
          localStorage.setItem(timestampKey, currentTime.toString());
        }
        setState({ loading: false, data, error: null });
      } catch (error) {
        setState({ loading: false, data: null, error });
      }
    };

    fetchData();
  }, [url, shouldCache]);

  return state;
};
