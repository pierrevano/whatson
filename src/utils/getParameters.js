const addParameter = (queryValue, queryAlternate, paramName) => {
  if (queryValue) {
    return `${paramName}=${queryValue}&`;
  } else if (typeof queryAlternate !== "undefined") {
    return `${paramName}=${queryAlternate}&`;
  }
  return "";
};

const handlePlatformsAndRatingsFilters = (
  mainQuery,
  alternateQuery,
  paramName,
) => {
  if (mainQuery) {
    return `${paramName}=${
      paramName === "ratings_filters"
        ? mainQuery
        : encodeURIComponent(mainQuery)
    }&`;
  } else if (typeof alternateQuery !== "undefined") {
    return `${paramName}=${
      paramName === "ratings_filters"
        ? alternateQuery
        : encodeURIComponent(alternateQuery)
    }&`;
  }
  return `${paramName}=all&`;
};

export const getParameters = (
  item_type_query,
  item_type,
  minimum_ratings_query,
  minimum_ratings,
  platforms_query,
  platforms,
  popularity_filters_query,
  popularity_filters,
  release_date_query,
  release_date,
  seasons_number_query,
  seasons_number,
  status_query,
  status,
  api_key_query,
  api_key,
  ratings_filters_query,
  ratings_filters,
) => {
  let parameters = "?";

  parameters += addParameter(item_type, item_type_query, "item_type");

  parameters += addParameter(
    minimum_ratings,
    minimum_ratings_query,
    "minimum_ratings",
  );

  parameters += addParameter(
    popularity_filters,
    popularity_filters_query,
    "popularity_filters",
  );

  parameters += addParameter(release_date, release_date_query, "release_date");

  parameters += addParameter(
    seasons_number,
    seasons_number_query,
    "seasons_number",
  );

  parameters += addParameter(status, status_query, "status");

  parameters += addParameter(api_key, api_key_query, "api_key");

  parameters += handlePlatformsAndRatingsFilters(
    platforms,
    platforms_query,
    "platforms",
  );

  parameters += handlePlatformsAndRatingsFilters(
    ratings_filters,
    ratings_filters_query,
    "ratings_filters",
  );

  parameters = parameters.replace(/&$/, "");

  return parameters;
};
