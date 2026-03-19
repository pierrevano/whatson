import { useEffect } from "react";
import queryString from "query-string";

const STORAGE_KEY = "umami";

/**
 * Injects the Umami tracker script when analytics are enabled for the current browser.
 * The `umami` query parameter can be used to persist an opt-in or opt-out preference.
 * @param {string} scriptUrl - Umami tracker script URL.
 * @param {string} websiteId - Umami website identifier.
 * @returns {void}
 */
const useAnalyticsScript = (scriptUrl, websiteId) => {
  const umami = localStorage.getItem(STORAGE_KEY) || "true";
  const queryStringParsed = queryString.parse(window.location.search);
  const umamiQuery = queryStringParsed.umami;

  useEffect(() => {
    if (typeof umamiQuery !== "undefined") {
      localStorage.setItem(STORAGE_KEY, umamiQuery);
    }

    if (umami === "false" || umamiQuery === "false") {
      return undefined;
    }

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"][data-website-id="${websiteId}"]`,
    );

    if (existingScript) {
      return undefined;
    }

    const script = document.createElement("script");

    script.defer = true;
    script.src = scriptUrl;
    script.setAttribute("data-website-id", websiteId);

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [scriptUrl, umami, umamiQuery, websiteId]);
};

export default useAnalyticsScript;
