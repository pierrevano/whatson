const addParameter = (queryValue, queryAlternate, paramName) => {
  if (queryValue) {
    return `${paramName}=${queryValue}&`;
  } else if (typeof queryAlternate !== "undefined") {
    return `${paramName}=${queryAlternate}&`;
  }
  return "";
};

const handlePlatformsAndRatingsFilters = (mainQuery, alternateQuery, paramName) => {
  if (mainQuery) {
    return `${paramName}=${paramName === "ratings_filters" ? mainQuery : encodeURIComponent(mainQuery)}&`;
  } else if (typeof alternateQuery !== "undefined") {
    return `${paramName}=${paramName === "ratings_filters" ? alternateQuery : encodeURIComponent(alternateQuery)}&`;
  }
  return `${paramName}=all&`;
};

export const getParameters = (cinema_id, cinema_id_query, item_type, item_type_query, minimum_ratings, minimum_ratings_query, platforms, platforms_query, popularity_filters, popularity_filters_query, ratings_filters, ratings_filters_query, seasons_number, seasons_number_query, status, status_query) => {
  let parameters = "?";

  parameters += addParameter(cinema_id, cinema_id_query, "cinema_id");
  parameters += addParameter(item_type, item_type_query, "item_type");
  parameters += addParameter(minimum_ratings, minimum_ratings_query, "minimum_ratings");
  parameters += addParameter(popularity_filters, popularity_filters_query, "popularity_filters");
  parameters += addParameter(seasons_number, seasons_number_query, "seasons_number");
  parameters += addParameter(status, status_query, "status");

  parameters += handlePlatformsAndRatingsFilters(platforms, platforms_query, "platforms");
  parameters += handlePlatformsAndRatingsFilters(ratings_filters, ratings_filters_query, "ratings_filters");

  parameters = parameters.replace(/&$/, "");

  return parameters;
};
