const STORAGE_KEY = "umami";

/**
 * Checks whether Umami tracking is enabled for the current browser.
 * @returns {boolean} True when tracking is enabled.
 */
export const shouldTrackAnalytics = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (window.localStorage.getItem(STORAGE_KEY) || "true") !== "false";
};

/**
 * Sends a custom Umami event when tracking is enabled and the tracker is loaded.
 * @param {string} eventName - Event name to send to Umami.
 * @param {object} [data] - Optional event properties.
 * @returns {void}
 */
export const trackAnalyticsEvent = (eventName, data) => {
  if (!shouldTrackAnalytics()) {
    return;
  }

  if (!eventName || typeof window === "undefined") {
    return;
  }

  if (data && Object.keys(data).length > 0) {
    window.umami?.track(eventName, data);
    return;
  }

  window.umami?.track(eventName);
};
