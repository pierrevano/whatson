const RETURN_PATH_KEY = "detail_return_path";
const RETURN_SCROLL_KEY = "detail_return_scroll";

const getStorage = () =>
  typeof window !== "undefined" ? window.sessionStorage : null;

/**
 * Builds a stable key for the current location including query params.
 * @returns {string} Current pathname and search string.
 */
export const getCurrentLocationKey = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return `${window.location.pathname}${window.location.search}`;
};

/**
 * Saves the current list location and scroll position before opening a detail page.
 * @returns {void}
 */
export const saveDetailReturnScroll = () => {
  const storage = getStorage();

  if (!storage || typeof window === "undefined") {
    return;
  }

  storage.setItem(RETURN_PATH_KEY, getCurrentLocationKey());
  storage.setItem(RETURN_SCROLL_KEY, String(window.scrollY || 0));
};

/**
 * Restores the saved scroll position once the list page has enough height again.
 * Returns a cleanup function so pending retries can be cancelled on unmount.
 * @param {string} locationKey - Current pathname and search string.
 * @returns {Function} Cleanup callback.
 */
export const restoreDetailReturnScroll = (locationKey) => {
  const storage = getStorage();

  if (!storage || typeof window === "undefined") {
    return () => {};
  }

  const savedPath = storage.getItem(RETURN_PATH_KEY);
  const savedScroll = Number(storage.getItem(RETURN_SCROLL_KEY));

  if (!savedPath || savedPath !== locationKey || Number.isNaN(savedScroll)) {
    return () => {};
  }

  let cancelled = false;
  let attempts = 0;

  const clearSavedScroll = () => {
    storage.removeItem(RETURN_PATH_KEY);
    storage.removeItem(RETURN_SCROLL_KEY);
  };

  const tryRestore = () => {
    if (cancelled) {
      return;
    }

    const maxScroll = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    const targetScroll = Math.min(savedScroll, maxScroll);

    if (maxScroll >= savedScroll - 16 || attempts >= 40) {
      window.scrollTo({ top: targetScroll, left: 0, behavior: "auto" });
      clearSavedScroll();
      return;
    }

    attempts += 1;
    window.setTimeout(tryRestore, 100);
  };

  window.setTimeout(tryRestore, 0);

  return () => {
    cancelled = true;
  };
};
