export const getParameters = (cinema_id, cinema_id_query, item_type, item_type_query, ratings_filters, ratings_filters_query, seasons_number, seasons_number_query) => {
  let parameters = "";

  if (cinema_id !== "") {
    parameters += `?cinema_id=${cinema_id}&`;
  } else if (typeof cinema_id_query !== "undefined") {
    parameters += `?cinema_id=${cinema_id_query}&`;
  } else {
    parameters += "?";
  }

  if (item_type !== "") {
    parameters += `item_type=${item_type}&`;
  } else if (typeof item_type_query !== "undefined") {
    parameters += `item_type=${item_type_query}&`;
  } else {
    parameters += "";
  }

  if (seasons_number !== "") {
    parameters += `seasons_number=${seasons_number}&`;
  } else if (typeof seasons_number_query !== "undefined") {
    parameters += `seasons_number=${seasons_number_query}&`;
  } else {
    parameters += "";
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
