import React from "react";
import { useFetch } from "react-hooks-fetch";
import { getKindByURL } from "utils/kind";
import Card from "./index";
import config from "../../config";

/**
 * A component that fetches data from a given URL and renders a Card component with the fetched data.
 * @param {string} kindURL - The URL of the kind of data to fetch.
 * @param {string} id - The ID of the specific data to fetch.
 * @returns A Card component with the fetched data, or a loading or error component if the data is not yet available or an error occurred.
 */
const FetchCard = ({ kindURL, id }) => {
  const { error, loading, data } = useFetch(
    [
      `https://api.themoviedb.org/3/${getKindByURL(kindURL)}/${id}`,
      `?api_key=${config.api}`,
    ].join(""),
  );

  if (loading) return <Card loading />;
  if (error) return <Card error />;

  return <Card id={id} kindURL={kindURL} {...data} />;
};

export default FetchCard;
