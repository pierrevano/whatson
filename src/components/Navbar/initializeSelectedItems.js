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
) => {
  const selectedItems = [];
  const filterLookup = createLookup([
    ...genres.items,
    ...minimum_ratings.items,
    ...must_see.items,
    ...platforms.items,
    ...popularity.items,
    ...ratings.items,
    ...release_date.items,
    ...seasons.items,
    ...status.items,
  ]);

  const parseCodes = (value, { lowercase = true } = {}) =>
    (lowercase ? (value || "").toLowerCase() : value || "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);

  const addSelections = (
    value,
    mapCode = (code) => code,
    parseOptions = undefined,
  ) => {
    parseCodes(value, parseOptions)
      .map(mapCode)
      .forEach((code) => {
        const item = filterLookup[code];
        if (item) {
          selectedItems.push(item);
        }
      });
  };

  addSelections(
    genres_value === "all"
      ? genres.items
          .filter((item) => item.code !== "allgenres")
          .map((item) => item.code)
          .join(",")
      : genres_value,
    undefined,
    { lowercase: false },
  );
  addSelections(minimum_ratings_value, (code) => {
    if (code === "5") {
      return code;
    }

    const numericValue = Number(code);
    return Number.isInteger(numericValue) ? `${numericValue}.0` : code;
  });
  addSelections(must_see_value, (code) => (code === "true" ? code : null));
  addSelections(
    platforms_value === "all"
      ? platforms.items
          .filter((item) => item.code !== "all")
          .map((item) => item.code)
          .join(",")
      : platforms_value,
    undefined,
    { lowercase: false },
  );
  addSelections(popularity_filters);
  addSelections(ratings_filters);
  addSelections(release_date_value);
  addSelections(seasons_number);
  addSelections(status_value);

  return selectedItems;
};
