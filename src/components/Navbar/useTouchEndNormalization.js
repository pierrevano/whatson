import { useEffect } from "react";

/**
 * Normalizes `touchend` events so libraries expecting `event.touches[0]`
 * can keep working on browsers that only expose `changedTouches` at drag end.
 *
 * This is kept local to the sidebar because it only exists to protect the
 * PrimeReact runtime slider used there.
 *
 * @returns {void}
 */
export const useTouchEndNormalization = () => {
  useEffect(() => {
    const normalizeTouchEndEvent = (event) => {
      if (
        (!event.touches || event.touches.length === 0) &&
        event.changedTouches &&
        event.changedTouches.length > 0
      ) {
        try {
          Object.defineProperty(event, "touches", {
            configurable: true,
            value: event.changedTouches,
          });
        } catch (error) {
          // Ignore read-only event implementations and let the browser continue.
        }
      }
    };

    document.addEventListener("touchend", normalizeTouchEndEvent, true);

    return () => {
      document.removeEventListener("touchend", normalizeTouchEndEvent, true);
    };
  }, []);
};

export default useTouchEndNormalization;
