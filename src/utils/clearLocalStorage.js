import config from "utils/config";

const base_render_website = config.base_render_website;

export const clearAndReload = () => {
  window.localStorage.clear();
  window.open(`${base_render_website}`, "_top");

  window.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      clearAndReload();
    }
  });
};
