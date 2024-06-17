import config from "./config";

const displayCheckMark = () => {
  document
    .querySelector(config.crossMarkSelector)
    .classList.add("display-none");
  document
    .querySelector(config.checkMarkSelector)
    .classList.remove("display-none");
};

export const onChangeHandler = (
  e,
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
  displayCheckMark();

  const originMapper = {
    minimum_ratings: [],
    platforms: [],
    popularity: [],
    ratings: [],
    release_date: [],
    seasons: [],
    status: [],
  };

  e.value.forEach(({ origin, code }) => {
    if (origin in originMapper) {
      originMapper[origin].push(code);
    }
  });

  setMinRatingsValue(originMapper["minimum_ratings"].join(","));

  const platformsSelectedItemsNumber = selectedItems.filter((item) =>
    ["platforms"].includes(item.origin),
  ).length;
  const platformsConfigItemsNumber = config.platforms.split(",").length;
  const platformsUnselectedItemsNumber = e.value.filter((item) =>
    ["platforms"].includes(item.origin),
  ).length;

  if (platformsUnselectedItemsNumber === 0) {
    setPlatformsValue(config.platforms);
  } else {
    setPlatformsValue(originMapper["platforms"].join(","));
  }

  if (
    (platformsSelectedItemsNumber !== platformsConfigItemsNumber ||
      platformsUnselectedItemsNumber !== platformsConfigItemsNumber) &&
    platformsConfigItemsNumber !== platformsUnselectedItemsNumber
  ) {
    if (Array.isArray(originMapper["platforms"])) {
      originMapper["platforms"] = originMapper["platforms"].filter(
        (item) => item !== "all",
      );
    }
    setPlatformsValue(originMapper["platforms"].join(","));
  }

  const minRatingsAndPopularityUnselectedItemsNumber = e.value.filter((item) =>
    ["minimum_ratings", "popularity"].includes(item.origin),
  ).length;

  if (minRatingsAndPopularityUnselectedItemsNumber === 0) {
    setPopularityFilters(config.popularity);
  } else {
    setPopularityFilters(originMapper["popularity"].join(","));
  }

  setRatingsFilters(originMapper["ratings"].join(","));
  setReleaseDateValue(originMapper["release_date"].join(","));
  setSeasonsNumber(originMapper["seasons"].join(","));
  setStatusValue(originMapper["status"].join(","));

  setSelectedItems(e.value);
};
