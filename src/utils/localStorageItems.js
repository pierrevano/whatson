import config from "../config";

const localStorageItems = {
  favorites: config.favorites,
  genres: config.genres,
  minimum_ratings: config.minimum_ratings,
  platforms: config.platforms,
  popularity_filters: config.popularity,
  ratings_filters: config.ratings,
  release_date: config.release_date,
  seasons_number: config.seasons,
  status: config.status,
};

export default localStorageItems;
