import { useEffect } from "react";

const useScript = (beamanalytics, url, token) => {
  useEffect(() => {
    if (beamanalytics === "true") {
      const script = document.createElement("script");

      script.src = url;
      script.async = true;
      script.setAttribute("data-token", token);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [beamanalytics, url, token]);
};

export default useScript;
