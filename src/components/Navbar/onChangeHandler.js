import config from "../../config";

function arePlatformsIncluded(config, originMapper) {
  const configPlatformsArray = config.platforms.split(",");
  const filteredConfigPlatforms = configPlatformsArray.filter(
    (platform) => platform.toLowerCase() !== "all",
  );
  return filteredConfigPlatforms.every((platform) =>
    originMapper.platforms.includes(platform),
  );
}

export const onChangeHandler = (
  e,
  item_type,
  selectedItems,
  setSelectedItems,
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

  if (value && value.origin === "minimum_ratings") {
    setMinRatingsValue(value.code);
  } else {
    setMinRatingsValue(originMapper.minimum_ratings.join(","));
  }

  setPopularityFilters(originMapper.popularity.join(","));
  setRatingsFilters(originMapper.ratings.join(","));
  setReleaseDateValue(originMapper.release_date.join(","));

  if (item_type && item_type === config.item_type.split(",")[1]) {
    if (arePlatformsIncluded(config, originMapper)) {
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
