import React, { Fragment, useEffect, useState } from "react";
import { useFetch } from "react-hooks-fetch";
import { useInView } from "react-intersection-observer";
import { Cell } from "griding";
import { getKindByURL } from "utils/kind";
import Card from "components/Card";
import InfoScreen from "components/InfoScreen";
import queryString from "query-string";
import { useStorageString } from "utils/useStorageString";
import { getParameters } from "utils/getParameters";

const queryStringParsed = queryString.parse(window.location.search);
const cinema_id_query = queryStringParsed.cinema_id;
const ratings_filters_query = queryStringParsed.ratings_filters;

const getDataURL = (kindURL, search, page, cinema_id, ratings_filters) => {
  const base = "https://api.themoviedb.org/3";
  const api = process.env.REACT_APP_TMDB_KEY;

  const cors_url = "https://cors-sites-aafe82ad9d0c.fly.dev/";
  const base_render = "https://whatson-api.onrender.com/";

  const parameters = getParameters(cinema_id, cinema_id_query, ratings_filters, ratings_filters_query);

  if (kindURL === "movies" || kindURL === "people" || kindURL === "search" || kindURL === "tv") return `${base}/search/${getKindByURL(kindURL)}?api_key=${api}&query=${search}&page=${page}`;
  return `${cors_url}${base_render}${parameters}`;
};

const InfiniteScroll = ({ page, setPage }) => {
  useEffect(() => setPage(page + 1));
  return null;
};

const CardsByPage = ({ search, page, setPage, isLastPage, kindURL }) => {
  const [cinema_id, setCinemaId] = useStorageString("cinema_id", "");
  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  useEffect(() => {
    if (typeof cinema_id_query !== "undefined") setCinemaId(cinema_id_query);
    if (typeof ratings_filters_query !== "undefined") setRatingsFilters(ratings_filters_query);
  });

  let { loading, data, error } = useFetch(getDataURL(kindURL, search, page, cinema_id, ratings_filters));
  if (data?.results?.length > 0) data = data?.results;

  const [ref, inView] = useInView();

  const errorMessage = [
    { title: "I’m sorry Dave.", description: "I’m afraid I can’t do that." },
    { title: "Into exile I must go.", description: "Failed I have." },
    { title: "Well, if I I've made a mistake,", description: "I'm sorry and I hope you'll forgive me." },
  ];

  const getRandomError = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const [randomData] = useState(() => getRandomError(errorMessage));

  if (error && search)
    return (
      <Cell xs={12}>
        <InfoScreen emoji="❌" title={randomData.title} description={randomData.description} />
      </Cell>
    );

  if (loading)
    return Array(20)
      .fill(0)
      .map((_x, i) => (
        <Cell key={i} xs={6} sm={4} md={3} xg={2}>
          <Card key={i} loading />
        </Cell>
      ));

  if (data && !data?.length)
    return (
      <Cell xs={12}>
        <InfoScreen emoji="😕" title={`No results found for ${search}`} description="let’s try another one" />
      </Cell>
    );

  if (!data?.length) return null;

  const totalPages = data?.total_pages;
  return (
    <Fragment>
      {data?.map((entry) => (
        <Cell key={entry.id} xs={6} sm={4} md={3} xg={2}>
          <Card kindURL={kindURL === "search" || kindURL === "movies" || kindURL === "people" || kindURL === "tv" ? kindURL : "movies"} {...entry} />
        </Cell>
      ))}
      {isLastPage && totalPages && totalPages > page && (
        <Cell xs={6} sm={4} md={3} xg={2}>
          <Card onClick={() => setPage(page + 1)} loadMore />
          {page > 1 && <div ref={ref}>{inView && <InfiniteScroll page={page} setPage={setPage} />}</div>}
        </Cell>
      )}
    </Fragment>
  );
};

export default CardsByPage;
