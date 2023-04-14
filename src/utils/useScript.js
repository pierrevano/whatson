import { useEffect } from "react";

const useScript = (url, token) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;
    script.setAttribute("data-token", token);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url, token]);
};

export default useScript;
