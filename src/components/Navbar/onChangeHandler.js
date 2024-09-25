import config from "../../config";

function areNamesIncluded(config, originMapper, source) {
  const configArray = config[source].split(",");
  const filteredConfigArray = configArray.filter(
    (item) =>
      item.toLowerCase() !== "all" || item.toLowerCase() !== "allgenres",
  );

  return filteredConfigArray.every((item) =>
    originMapper[source].includes(item),
  );
}

export const onChangeHandler = (
  e,
  item_type,
  selectedItems,
  setSelectedItems,
  setGenresValue,
  setMinRatingsValue,
  setPlatformsValue,
  setPopularityFilters,
  setRatingsFilters,
  setReleaseDateValue,
  setSeasonsNumber,
  setStatusValue,
) => {
  const { name, value, checked } = e.target;

  const originMapper = {
    genres: [],
    minimum_ratings: [],
    platforms: [],
    popularity: [],
    ratings: [],
    release_date: [],
    seasons: [],
    status: [],
  };

  const updatedItems = checked
    ? [...selectedItems, { origin: name, code: value }]
    : selectedItems.filter(
        (item) => !(item.origin === name && item.code === value),
      );

  updatedItems.forEach(({ origin, code }) => {
    if (origin in originMapper) {
      originMapper[origin].push(code);
    }
  });

  if (areNamesIncluded(config, originMapper, "genres")) {
    setGenresValue(config.genres);
  } else {
    setGenresValue(
      originMapper.genres
        .filter((genre) => genre.toLowerCase() !== "allgenres")
        .join(","),
    );
  }

  if (value && value.origin === "minimum_ratings") {
    setMinRatingsValue(value.code);
  } else {
    setMinRatingsValue(originMapper.minimum_ratings.join(","));
  }

  if (value === "enabled" && !checked) {
    setPopularityFilters("none");
  } else {
    setPopularityFilters(config.popularity);
  }

  setRatingsFilters(originMapper.ratings.join(","));
  setReleaseDateValue(originMapper.release_date.join(","));

  if (item_type && item_type === config.item_type.split(",")[1]) {
    if (areNamesIncluded(config, originMapper, "platforms")) {
      setPlatformsValue(config.platforms);
    } else {
      setPlatformsValue(
        originMapper.platforms
          .filter((platform) => platform.toLowerCase() !== "all")
          .join(","),
      );
    }
    setSeasonsNumber(originMapper.seasons.join(","));
    setStatusValue(originMapper.status.join(","));
  }

  setSelectedItems(updatedItems);
};
