import config from "../../config";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import localStorageItems from "utils/localStorageItems";
import postPreferences from "utils/postPreferences";
import updateLocalStorage from "utils/updateLocalStorage";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";

/**
 * Custom hook to initialize localStorage and save user preferences.
 *
 * @returns {null} - This hook does not return any values.
 */
async function initializeLocalStorage() {
  const { isAuthenticated, user } = useAuth0();

  const fetchUrl =
    isAuthenticated && user && user.email
      ? `${config.base_render_api}/preferences/${user.email}`
      : null;
  const { data, statusCode } = useFetchWithStatusCode(fetchUrl);

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
