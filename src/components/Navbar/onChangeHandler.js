import config from "../../config";

function areNamesIncluded(config, originMapper, source) {
  return config[source]
    .split(",")
    .every((item) => originMapper[source].includes(item));
}

export const onChangeHandler = (
  e,
  item_type,
  selectedItems,
  setSelectedItems,
  setGenresValue,
  setMinRatingsValue,
  setMustSeeValue,
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
    must_see: [],
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

  setSelectedItems(updatedItems);

  const sectionHandlers = {
    genres: () => {
      if (areNamesIncluded(config, originMapper, "genres")) {
        setGenresValue(config.genres);
      } else {
        setGenresValue(
          originMapper.genres
            .filter((genre) => genre.toLowerCase() !== "allgenres")
            .join(","),
        );
      }
    },
    must_see: () => {
      if (originMapper.must_see.length === 0) {
        setMustSeeValue("false");
      } else {
        setMustSeeValue(originMapper.must_see.join(","));
      }
    },
    platforms: () => {
      if (item_type === config.item_type.split(",")[1]) {
        if (areNamesIncluded(config, originMapper, "platforms")) {
          setPlatformsValue(config.platforms);
        } else {
          setPlatformsValue(
            originMapper.platforms
              .filter((platform) => platform.toLowerCase() !== "all")
              .join(","),
          );
        }
      }
    },
    popularity: () => {
      setPopularityFilters(checked ? config.popularity : "none");
    },
    ratings: () => {
      setRatingsFilters(originMapper.ratings.join(","));
    },
    release_date: () => {
      setReleaseDateValue(originMapper.release_date.join(","));
    },
    seasons: () => {
      if (item_type === config.item_type.split(",")[1]) {
        setSeasonsNumber(originMapper.seasons.join(","));
      }
    },
    status: () => {
      if (item_type === config.item_type.split(",")[1]) {
        setStatusValue(originMapper.status.join(","));
      }
    },
  };

  if (sectionHandlers[name]) {
    sectionHandlers[name]();
    return;
  }

  if (value?.origin === "minimum_ratings") {
    setMinRatingsValue(value.code);
  } else if (e.originalEvent.nativeEvent.target.innerText === "4.5 and more") {
    setMinRatingsValue("4.5");
  } else {
    setMinRatingsValue(originMapper.minimum_ratings.join(","));
  }
};
