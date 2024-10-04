import localStorageItems from "./localStorageItems";

/**
 * Update localStorage with preferences.
 *
 * @param {boolean} isAuthenticated - Determines whether to update all preferences or only those that do not exist.
 * @param {Object} preferences - Preferences to be saved in localStorage.
 */
function updateLocalStorage(isAuthenticated, preferences) {
  for (const key in localStorageItems) {
    if (isAuthenticated || !localStorage.getItem(key)) {
      localStorage.setItem(key, preferences[key]);
    }
  }
}

export default updateLocalStorage;
