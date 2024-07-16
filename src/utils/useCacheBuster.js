import { useEffect } from "react";
import { version } from "../../package.json";

const majorVersion = "2.5.0";

/**
 * Refreshes the cache and reloads the current page.
 */
const refreshCacheAndReload = async () => {
  if (caches) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((name) => caches.delete(name)));
  }
  window.location.reload(true);
};

/**
 * A custom React hook that fetches a meta.json file and compares the version number
 * to the current package version. If the meta.json version is greater than the package
 * version, the page is reloaded to update the cache.
 */
const useCacheBuster = () => {
  useEffect(() => {
    const parseVersion = (str) => +str.replace(/\D/g, "");

    const fetchMetaAndUpdateCache = async () => {
      try {
        const response = await fetch(`/meta.json?v=${+new Date()}`, {
          cache: "no-cache",
        });
        const meta = await response.json();
        if (meta?.version) {
          const metaVersion = parseVersion(meta.version);
          const packageVersion = parseVersion(version);
          const targetVersion = parseVersion(majorVersion);

          localStorage.setItem("version", metaVersion);

          if (packageVersion < targetVersion) {
            localStorage.clear();
          }

          if (packageVersion < metaVersion && window?.location?.reload) {
            refreshCacheAndReload();
          }
        }
      } catch (error) {
        console.error("Error fetching meta.json:", error);
      }
    };

    fetchMetaAndUpdateCache();
  }, []);

  return null;
};

export default useCacheBuster;
