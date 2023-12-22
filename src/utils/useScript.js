import { useEffect } from "react";
import queryString from "query-string";

const useScript = (url, token) => {
  const beamanalytics = localStorage.getItem("beamanalytics") || "true";
  const queryStringParsed = queryString.parse(window.location.search);
  const beamanalytics_query = queryStringParsed.beamanalytics;

  useEffect(() => {
    if (typeof beamanalytics_query !== "undefined") {
      localStorage.setItem("beamanalytics", beamanalytics_query);
    }

    if (beamanalytics !== "false" && beamanalytics_query !== "false") {
      const script = document.createElement("script");

      script.src = url;
      script.async = true;
      script.setAttribute("data-token", token);

      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [beamanalytics, beamanalytics_query, url, token]);
};

export default useScript;
