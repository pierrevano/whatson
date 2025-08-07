import config from "../config";
import postPreferences from "./postPreferences";

/**
 * Clears and resets localStorage with default preference values,
 * optionally posts preferences for authenticated users, and reloads the page.
 *
 * Also sets up a key listener for triggering the flow again externally.
 *
 * @param {boolean} isAuthenticated - Indicates if the user is authenticated.
 * @param {Object} user - The authenticated user's information used for posting preferences.
 * @returns {Promise<void>} A promise that resolves once preferences are posted (if applicable) and the page is reloaded.
 */
export const clearAndReload = async (isAuthenticated, user) => {
  const defaults = {
    genres: "",
    item_type: config.item_type,
    minimum_ratings: "",
    must_see: "",
    platforms: "",
    popularity_filters: "",
    ratings_filters: "",
    release_date: config.release_date,
    seasons_number: "",
    status: "",
  };

  for (const [key, value] of Object.entries(defaults)) {
    window.localStorage.setItem(key, value);
  }

  if (isAuthenticated && user) {
    await postPreferences({ ...defaults }, user);
  }

  window.location.reload();

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload(isAuthenticated, user);
    }
  });
};
