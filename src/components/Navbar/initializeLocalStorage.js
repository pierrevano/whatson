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
   * 2. If the remote `updated_at` is newer than the local `updated_at`
   * and remote preferences differ from local preferences, reload.
   */
  const localTime = new Date(localUpdatedAt).getTime();
  const remoteTime = new Date(data?.updated_at).getTime();

  for (const key in localStorageItems) {
    let localValue;
    setTimeout(() => {
      localValue = localStorage.getItem(key);
    }, 100);
    const remoteValue = data && data[key];

    if (
      remoteTime > localTime &&
      localValue &&
      remoteValue &&
      localValue !== remoteValue
    )
      return true;
  }

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

  if (isAuthenticated && shouldReload(data)) {
    localStorage.setItem("updated_at", new Date().toISOString());

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }

  let preferences = { ...localStorageItems };

  useEffect(() => {
    if (isAuthenticated && user && user.email) {
      if (data) {
        preferences = { ...data };
      } else if (statusCode === 404) {
        postPreferences(preferences, user);
      }

      updateLocalStorage(isAuthenticated, preferences);
    }
  }, [data, isAuthenticated, statusCode, user]);

  if (!isAuthenticated) {
    updateLocalStorage(isAuthenticated, preferences);
  }
}

export default initializeLocalStorage;
