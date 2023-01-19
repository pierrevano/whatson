export const getParameters = (cinema_id, cinema_id_query, ratings_filters, ratings_filters_query) => {
  let parameters = "";

  if (cinema_id !== "") {
    parameters += `?cinema_id=${cinema_id}&`;
  } else if (typeof cinema_id_query !== "undefined") {
    parameters += `?cinema_id=${cinema_id_query}&`;
  } else {
    parameters += "?";
  }

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
