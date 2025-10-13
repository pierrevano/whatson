function createItems(nameArray, origin) {
  return nameArray
    .map((name) => {
      let processedName;
      let nameToProcess = name;

      if (origin !== "genres" && origin !== "platforms") {
        nameToProcess = name
          .toLowerCase()
          .replaceAll("allociné", "allocine")
          .replaceAll("rotten tomatoes", "rottentomatoes")
          .replaceAll("tv time", "tvtime");

        if (nameToProcess.includes(" and more")) {
          nameToProcess = nameToProcess.replaceAll(" and more", "");
          if (!nameToProcess.endsWith(".5") && nameToProcess !== "5") {
            nameToProcess += ".0";
          }
        }

        processedName = nameToProcess.replaceAll(" ", "_");
      } else {
        processedName = name;
      }

      const capitalizedFirstLetterName =
        name.charAt(0).toUpperCase() + name.slice(1);
      return { name: capitalizedFirstLetterName, code: processedName, origin };
    })
    .flat();
}

export const createFilters = (config) => {
  const genres = {
    name: "Genres",
    items: createItems(config.genres.split(","), "genres"),
  };
  const minimum_ratings = {
    name: "Minimum ratings",
    items: createItems(
      config.minimum_ratings_names.split(","),
      "minimum_ratings",
    ),
  };
  const must_see = {
    name: "Metacritic items",
    items: createItems(config.must_see_names.split(","), "must_see"),
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
    items: createItems(config.ratings_names.split(","), "ratings"),
  };
  const release_date = {
    name: "Release date",
    items: createItems(config.release_date_names.split(","), "release_date"),
  };
  const seasons = {
    name: "Seasons",
    items: createItems(config.seasons_names.split(","), "seasons"),
  };
  const status = {
    name: "Status",
    items: createItems(config.status.split(","), "status"),
  };

  return {
    genres,
    minimum_ratings,
    must_see,
    platforms,
    popularity,
    ratings,
    release_date,
    seasons,
    status,
  };
};
