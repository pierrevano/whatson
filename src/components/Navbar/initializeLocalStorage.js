import config from "../../config";

const localStorageItems = {
  minimum_ratings: config.minimum_ratings,
  platforms: config.platforms,
  popularity_filters: config.popularity,
  ratings_filters: config.ratings,
  release_date: config.release_date,
  seasons_number: config.seasons,
  status: config.status,
};

function initializeLocalStorage() {
  for (let key in localStorageItems) {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, localStorageItems[key]);
    }
  }
}

export default initializeLocalStorage;
