import { useEffect } from "react";
import { useStorageString } from "./useStorageString";

/**
 * Refreshes the cache and reloads the current page.
 * @returns None
 */
const refreshCacheAndReload = () => {
  if (caches) {
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  // delete browser cache and hard reload
  window.location.reload(true);
};

/**
 * A custom React hook that checks for updates to the app version and refreshes the cache if necessary.
 * @returns {null}
 */
const useCacheBuster = () => {
  const parseVersion = (str) => +str.replace(/\D/g, "");
  const [version, setVersion] = useStorageString("version", "1.0.0");
  console.log(`Current What's on? app version: ${version}`);

  useEffect(() => {
    fetch(`/meta.json?v=${+new Date()}`, { cache: "no-cache" })
      .then((response) => response.json())
      .then((meta) => {
        if (meta?.version) {
          const metaVersion = meta.version;
          if (parseVersion(version) < parseVersion(metaVersion)) {
            if (window?.location?.reload) {
              setVersion(metaVersion);
              refreshCacheAndReload();
            }
          }
        }
      })
      .catch((error) => {
        console.error("something went wrong fetching meta.json", error);
      });
  }, [version, setVersion]);

  return null;
};

export default useCacheBuster;
