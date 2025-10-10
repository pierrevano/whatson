import config from "../config";

const localStorageItems = {
  favorites: config.favorites,
  genres: config.genres,
  minimum_ratings: config.minimum_ratings,
  must_see: config.must_see,
  platforms: config.platforms,
  popularity_filters: config.popularity,
  ratings_filters: config.ratings,
  release_date: config.release_date,
  runtime: config.runtime,
  seasons_number: config.seasons,
  status: config.status,
};

export default localStorageItems;
