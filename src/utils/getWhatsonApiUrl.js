import config from "../config";

/**
 * Updates a URL.
 * @param {string} url - Input URL.
 * @returns {string} Updated URL.
 */
export const getWhatsonApiUrl = (url) => {
  const apiKey =
    new URLSearchParams(window.location.search).get("api_key") ||
    window.localStorage.getItem("api_key") ||
    config.base_render_api_key;

  if (!apiKey) return url;

  const apiUrl = new URL(url);
  apiUrl.searchParams.set("api_key", apiKey);
  return apiUrl.toString();
};
