import localStorageItems from "./localStorageItems";
import postPreferences from "./postPreferences";

/**
 * Clears the local storage, reloads the current page, and adds an event listener
 * for the "Enter" key to trigger the function again.
 *
 * @param {Object} user - The user object containing user-specific information
 * needed for posting preferences.
 *
 * @returns {Promise<void>} A promise that resolves once the preferences are posted
 * and the page is reloaded.
 */
export const clearAndReload = async (user) => {
  let preferences = {
    ...localStorageItems,
  };
  await postPreferences(preferences, user);

  window.localStorage.clear();
  window.location.reload();

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload(user);
    }
  });
};
