/**
 * Returns the chip label displayed to the user for a given filter item.
 *
 * @param {{ name: string }} item - Filter item.
 * @returns {string} Human-readable chip label.
 */
export const getFilterItemLabel = (item) => {
  if (item.name === "True") {
    return "Metacritic must-see only";
  }

  if (item.name === "Enabled") {
    return "Include major platform trends";
  }

  if (item.name === "New") {
    return "Recent items only";
  }

  return item.name;
};

/**
 * Filters out the synthetic or hidden items that should not be rendered as chips.
 *
 * @param {{ origin: string, code: string }} item - Filter item.
 * @returns {boolean} Whether the item should be rendered.
 */
export const isVisibleFilterItem = (item) =>
  !(
    (item.origin === "genres" && item.code === "allgenres") ||
    (item.origin === "must_see" && item.code === "false") ||
    (item.origin === "platforms" && item.code === "all") ||
    (item.origin === "popularity" && item.code !== "enabled") ||
    (item.origin === "release_date" && item.code !== "new")
  );

/**
 * Builds the popularity group shown in the sidebar.
 *
 * @param {{ items: Array<object> }} popularity - Popularity group from `createFilters`.
 * @param {object | undefined} mustSeeToggleItem - The visible Metacritic must-see chip item.
 * @returns {{ items: Array<object> }} Sidebar popularity group.
 */
export const buildPopularityGroup = (popularity, mustSeeToggleItem) => ({
  ...popularity,
  items: [
    ...popularity.items.filter((item) => item.code === "enabled"),
    ...(mustSeeToggleItem ? [mustSeeToggleItem] : []),
  ],
});

/**
 * Returns the ordered list of sidebar filter groups for the current item type.
 *
 * @param {object} params - Grouping inputs.
 * @param {string} params.itemType - Current item type.
 * @param {string[]} params.defaultItemTypeFilters - Available item types from config.
 * @param {object} params.releaseDate - Release date group.
 * @param {object} params.popularityGroup - Popularity group.
 * @param {object} params.minimumRatings - Minimum ratings group.
 * @param {object} params.platforms - Platforms group.
 * @param {object} params.genres - Genres group.
 * @param {object} params.ratings - Ratings group.
 * @param {object} params.seasons - Seasons group.
 * @param {object} params.status - Status group.
 * @returns {object[]} Ordered sidebar groups.
 */
export const buildGroupedItems = ({
  itemType,
  defaultItemTypeFilters,
  releaseDate,
  popularityGroup,
  minimumRatings,
  platforms,
  genres,
  ratings,
  seasons,
  status,
}) => {
  if (itemType && itemType === defaultItemTypeFilters[1]) {
    return [
      releaseDate,
      popularityGroup,
      minimumRatings,
      platforms,
      genres,
      ratings,
      seasons,
      status,
    ];
  }

  return [releaseDate, popularityGroup, minimumRatings, genres, ratings];
};
