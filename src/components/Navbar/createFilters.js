function createItems(nameArray, origin) {
  return nameArray
    .map((name) => {
      let processedName;

      if (origin === "platforms") {
        processedName = name;
      } else {
        processedName = name
          .toLowerCase()
          .replaceAll("allociné", "allocine")
          .replaceAll("rotten tomatoes", "rottenTomatoes")
          .replaceAll(" and more", "")
          .replaceAll(" ", "_");
      }

      const capitalizedFirstLetterName =
        name.charAt(0).toUpperCase() + name.slice(1);

      return { name: capitalizedFirstLetterName, code: processedName, origin };
    })
    .flat();
}

export const createFilters = (config, item_type, defaultItemTypeFilters) => {
  const minimum_ratings = {
    name: "Minimum ratings",
    items: createItems(
      config.minimum_ratings_names.split(","),
      "minimum_ratings",
    ),
  };
  const platforms = {
    name: "Platforms",
    items: createItems(config.platforms.split(","), "platforms"),
  };
  const popularity = {
    name: "Popularity",
    items: createItems(config.popularity.split(","), "popularity"),
  };
  const ratings = {
    name: "Ratings",
    items: createItems(
      config.ratings_names.split(","),
      "ratings",
      item_type,
      defaultItemTypeFilters,
    ),
  };
  const release_date = {
    name: "Release date",
    items: createItems(config.release_date_names.split(","), "release_date"),
  };
  const seasons = {
    name: "Seasons",
    items: createItems(config.seasons.split(","), "seasons"),
  };
  const status = {
    name: "Status",
    items: createItems(config.status.split(","), "status"),
  };

  return {
    minimum_ratings,
    platforms,
    popularity,
    ratings,
    release_date,
    seasons,
    status,
  };
};
