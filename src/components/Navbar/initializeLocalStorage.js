import config from "./config";

function initializeLocalStorage() {
  if (!localStorage.getItem("popularity_filters")) {
    localStorage.setItem("popularity_filters", config.popularity);
  }

  if (!localStorage.getItem("ratings_filters")) {
    localStorage.setItem("ratings_filters", config.ratings);
  }

  if (!localStorage.getItem("minimum_ratings")) {
    localStorage.setItem("minimum_ratings", config.minimum_ratings);
  }

  if (!localStorage.getItem("seasons_number")) {
    localStorage.setItem("seasons_number", config.seasons);
  }

  if (!localStorage.getItem("status")) {
    localStorage.setItem("status", config.status);
  }
}

export default initializeLocalStorage;
