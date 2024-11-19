import { getPreferences } from "utils/getPreferences";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import localStorageItems from "utils/localStorageItems";
import postPreferences from "utils/postPreferences";
import updateLocalStorage from "utils/updateLocalStorage";

const shouldReload = (data) => {
  /*
   * 1. If there is no `updated_at` in localStorage, reload.
   */
  const localUpdatedAt = localStorage.getItem("updated_at");
  if (!localUpdatedAt) return true;

  /*
   * 2. If the remote `updated_at` is newer than the local `updated_at`, reload.
   */
  const remoteTime = new Date(data?.updated_at).getTime();
  const localTime = new Date(localUpdatedAt).getTime();
  if (remoteTime > localTime) return true;

  /*
   * 3. Else, don't reload.
   */
  return false;
};

/**
 * Custom hook to initialize localStorage and save user preferences.
 *
 * @returns {null} - This hook does not return any values.
 */
async function initializeLocalStorage() {
  const { isAuthenticated, user } = useAuth0();
  const { data, statusCode } = getPreferences(isAuthenticated, user);
  let preferences = { ...localStorageItems };

  if (isAuthenticated && shouldReload(data)) {
    localStorage.setItem("updated_at", new Date().toISOString());

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  useEffect(() => {
    if (isAuthenticated && user && user.email) {
      if (statusCode === 200 && data) {
        preferences = { ...data };
        updateLocalStorage(isAuthenticated, preferences);
      } else if (statusCode === 404) {
        postPreferences(preferences, user);
      }
    } else if (!isAuthenticated) {
      updateLocalStorage(isAuthenticated, preferences);
    }
  }, [data, isAuthenticated, statusCode, user]);
}

export default initializeLocalStorage;
