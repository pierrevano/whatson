const addParameter = (queryValue, queryAlternate, paramName) => {
  if (queryValue) {
    return `${paramName}=${queryValue}&`;
  } else if (typeof queryAlternate !== "undefined") {
    return `${paramName}=${queryAlternate}&`;
  }
  return "";
};

const handleEncodedFilters = (mainQuery, alternateQuery, paramName) => {
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
  genres_query,
  genres,
  is_active_query,
  is_active,
  item_type_query,
  item_type,
  minimum_ratings_query,
  minimum_ratings,
  must_see_query,
  must_see,
  platforms_query,
  platforms,
  popularity_filters_query,
  popularity_filters,
  top_ranking_order_query,
  top_ranking_order,
  mojo_rank_order_query,
  mojo_rank_order,
  release_date_query,
  release_date,
  runtime_query,
  runtime,
  seasons_number_query,
  seasons_number,
  status_query,
  status,
  api_key_query,
  api_key,
  append_to_response_query,
  append_to_response,
  ratings_filters_query,
  ratings_filters,
) => {
  let parameters = "?";

  parameters += addParameter(is_active, is_active_query, "is_active");

  parameters += addParameter(item_type, item_type_query, "item_type");

  parameters += addParameter(
    minimum_ratings,
    minimum_ratings_query,
    "minimum_ratings",
  );

  parameters += addParameter(must_see, must_see_query, "must_see");

  parameters += addParameter(
    popularity_filters,
    popularity_filters_query,
    "popularity_filters",
  );

  parameters += addParameter(
    top_ranking_order,
    top_ranking_order_query,
    "top_ranking_order",
  );

  parameters += addParameter(
    mojo_rank_order,
    mojo_rank_order_query,
    "mojo_rank_order",
  );

  parameters += addParameter(release_date, release_date_query, "release_date");

  parameters += addParameter(runtime, runtime_query, "runtime");

  parameters += addParameter(
    seasons_number,
    seasons_number_query,
    "seasons_number",
  );

  parameters += addParameter(status, status_query, "status");

  parameters += addParameter(api_key, api_key_query, "api_key");

  parameters += addParameter(
    append_to_response,
    append_to_response_query,
    "append_to_response",
  );

  parameters += handleEncodedFilters(genres, genres_query, "genres");

  parameters += handleEncodedFilters(platforms, platforms_query, "platforms");

  parameters += handleEncodedFilters(
    ratings_filters,
    ratings_filters_query,
    "ratings_filters",
  );

  parameters = parameters.replace(/&$/, "");

  return parameters;
};
