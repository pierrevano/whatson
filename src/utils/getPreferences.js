import { createHashForEmail } from "./createHashForEmail";
import config from "../config";
import useFetchWithStatusCode from "./useFetchWithStatusCode";

export const getPreferences = (isAuthenticated, user) => {
  const fetchUrl =
    isAuthenticated && user && user.email
      ? (() => {
          const emailHash = createHashForEmail(
            user.email,
            config.digest_secret_value,
          );
          return `${config.base_render_api}/preferences/${user.email}?digest=${emailHash}`;
        })()
      : null;

  return useFetchWithStatusCode(fetchUrl);
};
