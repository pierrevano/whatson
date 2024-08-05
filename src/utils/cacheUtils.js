import config from "./config";

export const retrieveFromCache = (dataUrl) => {
  const cacheEntry = JSON.parse(localStorage.getItem(dataUrl));
  if (cacheEntry) {
    const isExpired =
      Date.now() - cacheEntry.timestamp >
      config.cache_expiration_duration_milliseconds;
    if (!isExpired) {
      return cacheEntry.data;
    } else {
      localStorage.removeItem(dataUrl);
    }
  }
  return null;
};

export const saveToCache = (dataUrl, data) => {
  localStorage.setItem(
    dataUrl,
    JSON.stringify({ data, timestamp: Date.now() }),
  );
};
