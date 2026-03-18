import config from "../config";

const localStorageItems = {
  favorites: config.favorites,
  genres: "",
  minimum_ratings: "",
  must_see: "",
  platforms: "",
  popularity_filters: config.popularity
    .split(",")
    .filter((code) => code !== "enabled")
    .join(","),
  top_ranking_order: config.top_ranking_order,
  mojo_rank_order: config.mojo_rank_order,
  ratings_filters: "",
  release_date: "",
  runtime: config.runtime,
  seasons_number: "",
  status: "",
};

export default localStorageItems;
