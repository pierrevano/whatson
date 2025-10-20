function createLookup(itemsArray) {
  return itemsArray.reduce((lookup, item) => {
    lookup[item.code] = item;
    return lookup;
  }, {});
}

export const initializeSelectedItems = (
  genres,
  genres_value,
  minimum_ratings,
  minimum_ratings_value,
  must_see,
  must_see_value,
  platforms,
  platforms_value,
  popularity,
  popularity_filters,
  ratings,
  ratings_filters,
  release_date,
  release_date_value,
  status,
  status_value,
  seasons,
  seasons_number,
  config,
  item_type,
  defaultItemTypeFilters,
) => {
  const selectedItems = [];
  const defaultMinRatingsValue = config.minimum_ratings.split(",");
  const minRatingsLookup = createLookup(minimum_ratings.items);

  defaultMinRatingsValue.forEach((filter) => {
    const minimum_ratings_array = minimum_ratings_value.split(",").map(Number);
    if (
      !minimum_ratings_value ||
      minimum_ratings_array.includes(Number(filter))
    ) {
      selectedItems.push(minRatingsLookup[filter]);
    }
  });

  const filterLookup = createLookup([
    ...genres.items,
    ...must_see.items,
    ...platforms.items,
    ...popularity.items,
    ...ratings.items,
    ...release_date.items,
    ...status.items,
  ]);

  const defaultGenresValue = config.genres.split(",");
  defaultGenresValue.forEach((filter) => {
    if (!genres_value || genres_value.includes(filter)) {
      selectedItems.push(filterLookup[filter]);
    }
  });

  const parseCodes = (value) =>
    (value || "")
      .toLowerCase()
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  const storedMustSeeSelections = parseCodes(must_see_value).filter(
    (code) => code === "true",
  );

  const defaultMustSeeSelections = parseCodes(config.must_see).filter(
    (code) => code === "true",
  );

  const mustSeeSelections =
    storedMustSeeSelections.length > 0
      ? storedMustSeeSelections
      : defaultMustSeeSelections;

  mustSeeSelections.forEach((filter) => {
    const item = filterLookup[filter];
    if (item) {
      selectedItems.push(item);
    }
  });

  const defaultPlatformsValue = config.platforms.split(",");
  defaultPlatformsValue.forEach((filter) => {
    if (!platforms_value || platforms_value.includes(filter)) {
      selectedItems.push(filterLookup[filter]);
    }
  });

  const defaultPopularityValue = config.popularity.toLowerCase().split(",");
  defaultPopularityValue.forEach((filter) => {
    if (!popularity_filters || popularity_filters.includes(filter)) {
      selectedItems.push(filterLookup[filter]);
    }
  });

  const defaultRatingsFilters = config.ratings.split(",");
  defaultRatingsFilters.forEach((filter) => {
    if (!ratings_filters || ratings_filters.includes(filter)) {
      selectedItems.push(filterLookup[filter]);
    }
  });

  const defaultReleaseDateValue = config.release_date_names
    .toLowerCase()
    .split(",");
  defaultReleaseDateValue.forEach((filter) => {
    if (!release_date_value || release_date_value.includes(filter)) {
      selectedItems.push(filterLookup[filter]);
    }
  });

  if (item_type && item_type === defaultItemTypeFilters[1]) {
    const seasonsLookup = createLookup(seasons.items);
    const defaultSeasonsNumber = config.seasons.split(",");
    defaultSeasonsNumber.forEach((filter) => {
      if (!seasons_number || seasons_number.includes(filter)) {
        selectedItems.push(seasonsLookup[filter]);
      }
    });

    const defaultStatusValue = config.status.split(",");
    defaultStatusValue.forEach((filter) => {
      if (!status_value || status_value.includes(filter)) {
        selectedItems.push(filterLookup[filter]);
      }
    });
  }

  return selectedItems;
};
