import { useEffect } from "react";
import { version } from "../../package.json";

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
 * A custom React hook that fetches a meta.json file and compares the version number
 * to the current package version. If the meta.json version is greater than the package
 * version, the page is reloaded to update the cache.
 * @returns {null}
 */
const useCacheBuster = () => {
  const parseVersion = (str) => +str.replace(/\D/g, "");

  useEffect(() => {
    fetch(`/meta.json?v=${+new Date()}`, { cache: "no-cache" })
      .then((response) => response.json())
      .then((meta) => {
        if (meta?.version) {
          const metaVersion = parseVersion(meta.version);
          const packageVersion = parseVersion(version);
          localStorage.setItem("version", { metaVersion: metaVersion, packageVersion: packageVersion });
          if (packageVersion < metaVersion) {
            if (window?.location?.reload) {
              refreshCacheAndReload();
              window.location.reload();
            }
          }
        }
      })
      .catch((error) => {
        console.error("something went wrong fetching meta.json", error);
      });
  }, []);

  return null;
};

export default useCacheBuster;
