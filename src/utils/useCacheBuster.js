import { useEffect } from "react";
import { useStorageString } from "./useStorageString";

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
              window.location.reload(true);
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
