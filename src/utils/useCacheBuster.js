import { useEffect } from "react";
import packageJson from "../../package.json";

const majorVersion = "2.5.0";

/**
 * Refreshes the cache and reloads the current page.
 * @returns None
 */
const refreshCacheAndReload = () => {
  const cacheStorage =
    typeof window !== "undefined" && "caches" in window ? window.caches : null;

  if (cacheStorage?.keys) {
    cacheStorage.keys().then((names) => {
      for (const name of names) {
        cacheStorage.delete(name);
      }
    });
  }

  if (typeof window !== "undefined" && window.location?.reload) {
    window.location.reload(true);
  }
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
    const fetchMeta = async () => {
      try {
        const response = await fetch(`/meta.json?v=${+new Date()}`, {
          cache: "no-cache",
        });
        const meta = await response.json();

        if (meta?.version) {
          const metaVersion = parseVersion(meta.version);
          const packageVersion = parseVersion(packageJson.version);
          const targetVersion = parseVersion(majorVersion);

          localStorage.setItem("version", metaVersion);
          if (packageVersion < targetVersion) {
            localStorage.clear();
          }

          if (packageVersion < metaVersion) {
            if (window?.location?.reload) {
              refreshCacheAndReload();
            }
          }
        }
      } catch (error) {}
    };

    fetchMeta();
  }, []);

  return null;
};

export default useCacheBuster;
