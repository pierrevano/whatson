export const clearAndReload = () => {
  window.localStorage.clear();
  window.location.reload();

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload();
    }
  });
};
