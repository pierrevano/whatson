/**
 * Clears the local storage and reloads the current page. Also listens for the "Enter" key
 * to be pressed and calls the function again if it is.
 * @returns None
 */
export const clearAndReload = () => {
  window.localStorage.clear();
  window.location.reload();

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload();
    }
  });
};
