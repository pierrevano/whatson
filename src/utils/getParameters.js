export const getParameters = (cinema_id, cinema_id_query, item_type, item_type_query, minimum_ratings, minimum_ratings_query, platforms, platforms_query, popularity_filters, popularity_filters_query, ratings_filters, ratings_filters_query, seasons_number, seasons_number_query, status, status_query) => {
  let parameters = "?";

  let addParameter = (queryValue, queryAlternate, paramName) => {
    if (queryValue !== "") {
      parameters += `${paramName}=${encodeURIComponent(queryValue)}&`;
    } else if (typeof queryAlternate !== "undefined") {
      parameters += `${paramName}=${encodeURIComponent(queryAlternate)}&`;
    }
  };

  addParameter(cinema_id, cinema_id_query, "cinema_id");
  addParameter(item_type, item_type_query, "item_type");
  addParameter(minimum_ratings, minimum_ratings_query, "minimum_ratings");
  addParameter(platforms, platforms_query, "platforms");
  addParameter(popularity_filters, popularity_filters_query, "popularity_filters");
  addParameter(seasons_number, seasons_number_query, "seasons_number");
  addParameter(status, status_query, "status");

  if (ratings_filters !== "") {
    parameters += `ratings_filters=${ratings_filters}&`;
  } else if (typeof ratings_filters_query !== "undefined") {
    parameters += `ratings_filters=${ratings_filters_query}&`;
  } else {
    parameters += `ratings_filters=all`;
  }

  parameters = parameters.replace(/&$/, "");

  return parameters;
};
