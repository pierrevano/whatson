import { useEffect } from "react";
import { version } from "../../package.json";

const useCacheBuster = () => {
  const parseVersion = (str) => +str.replace(/\D/g, "");
  const packageVersion = parseVersion(version);
  console.log(`Current What's on? app version: ${packageVersion}`);

  useEffect(() => {
    fetch(`/meta.json?v=${+new Date()}`, { cache: "no-cache" })
      .then((response) => response.json())
      .then((meta) => {
        if (meta?.version) {
          const metaVersion = parseVersion(meta.version);
          if (packageVersion < metaVersion) {
            if (window?.location?.reload) {
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
