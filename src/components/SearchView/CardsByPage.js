import React, { Fragment, useEffect, useState } from "react";
import { useConditionalFetch } from "utils/useConditionalFetch";
import { useInView } from "react-intersection-observer";
import { Cell } from "griding";
import { getKindByURL } from "utils/kind";
import Card from "components/Card";
import InfoScreen from "components/InfoScreen";
import queryString from "query-string";
import { useStorageString } from "utils/useStorageString";
import { getParameters } from "utils/getParameters";
import config from "config";

const queryStringParsed = queryString.parse(window.location.search);
const api_key_query = queryStringParsed.api_key;
const genres_query = queryStringParsed.genres;
const item_type_query = queryStringParsed.item_type;
const minimum_ratings_query = queryStringParsed.minimum_ratings;
const platforms_query = queryStringParsed.platforms;
const popularity_filters_query = queryStringParsed.popularity_filters;
const ratings_filters_query = queryStringParsed.ratings_filters;
const release_date_query = queryStringParsed.release_date;
const seasons_number_query = queryStringParsed.seasons_number;
const status_query = queryStringParsed.status;

const getDataURL = (
  api_key,
  genres,
  item_type,
  kindURL,
  minimum_ratings,
  page,
  platforms,
  popularity_filters,
  ratings_filters,
  release_date,
  search,
  seasons_number,
  status,
) => {
  const parameters = getParameters(
    genres_query,
    genres,
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
    undefined,
    "",
    ratings_filters_query,
    ratings_filters,
  );

  if (
    kindURL === "movies" ||
    kindURL === "people" ||
    kindURL === "search" ||
    kindURL === "tvshows"
  ) {
    return `${config.base}/search/${getKindByURL(kindURL)}?api_key=${config.api}&query=${search}&page=${page}`;
  }

  return `${config.base_render_api}/${parameters}&page=${page}`;
};

const InfiniteScroll = ({ page, setPage }) => {
  useEffect(() => setPage(page + 1), [setPage, page]);
  return null;
};

/**
 * Renders a list of cards based on the search query and page number.
 * @param {Object} props - The props object.
 * @param {string} props.search - The search query.
 * @param {number} props.page - The current page number.
 * @param {function} props.setPage - The function to set the current page number.
 * @param {boolean} props.isLastPage - A boolean indicating if the current page is the last page.
 * @param {string} props.kindURL - The kind of URL to fetch data from.
 * @returns The list of cards to be rendered.
 */
const CardsByPage = ({ search, page, setPage, isLastPage, kindURL }) => {
  const [api_key, setApiKey] = useStorageString("api_key", "");
  const [genres_value, setGenresValue] = useStorageString("genres", "");
  const [item_type, setItemType] = useStorageString("item_type", "movie");
  const [minimum_ratings_value, setMinRatingsValue] = useStorageString(
    "minimum_ratings",
    "",
  );
  const [platforms_value, setPlatformsValue] = useStorageString(
    "platforms",
    "",
  );
  const [popularity_filters, setPopularityFilters] = useStorageString(
    "popularity_filters",
    "",
  );
  const [ratings_filters, setRatingsFilters] = useStorageString(
    "ratings_filters",
    "",
  );
  const [release_date, setReleaseDate] = useStorageString("release_date", "");
  const [seasons_number, setSeasonsNumber] = useStorageString(
    "seasons_number",
    "",
  );
  const [status_value, setStatusValue] = useStorageString("status", "");

  useEffect(() => {
    if (typeof api_key_query !== "undefined") setApiKey(api_key_query);
    if (typeof genres_query !== "undefined") setGenresValue(genres_query);
    if (typeof item_type_query !== "undefined") setItemType(item_type_query);
    if (typeof minimum_ratings_query !== "undefined")
      setMinRatingsValue(minimum_ratings_query);
    if (typeof platforms_query !== "undefined")
      setPlatformsValue(platforms_query);
    if (typeof popularity_filters_query !== "undefined")
      setPopularityFilters(popularity_filters_query);
    if (typeof ratings_filters_query !== "undefined")
      setRatingsFilters(ratings_filters_query);
    if (typeof release_date_query !== "undefined")
      setReleaseDate(release_date_query);
    if (typeof seasons_number_query !== "undefined")
      setSeasonsNumber(seasons_number_query);
    if (typeof status_query !== "undefined") setStatusValue(status_query);
  }, [
    setGenresValue,
    setItemType,
    setMinRatingsValue,
    setPlatformsValue,
    setPopularityFilters,
    setRatingsFilters,
    setReleaseDate,
    setSeasonsNumber,
    setStatusValue,
  ]);

  const fetchUrl = getDataURL(
    api_key,
    genres_value,
    item_type,
    kindURL,
    minimum_ratings_value,
    page,
    platforms_value,
    popularity_filters,
    ratings_filters,
    release_date,
    search,
    seasons_number,
    status_value,
  );

  const isKindURLDefined =
    kindURL === "movies" ||
    kindURL === "people" ||
    kindURL === "search" ||
    kindURL === "tvshows";

  const { loading, data, error } = useConditionalFetch(
    fetchUrl,
    item_type,
    page,
    !isKindURLDefined,
  );

  const [ref, inView] = useInView();

  const getDefaultItemType = (item_type_query) => {
    if (item_type === "tvshow" || item_type_query === "tvshow")
      return "tvshows";
    if (item_type === "movie" || item_type_query === "movie") return "movies";
    return "movies";
  };

  const errorMessage = [
    { title: "I’m sorry Dave.", description: "I’m afraid I can’t do that." },
    { title: "Into exile I must go.", description: "Failed I have." },
    {
      title: "Well, if I've made a mistake,",
      description: "I'm sorry and I hope you'll forgive me.",
    },
  ];

  const getRandomError = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const [randomData] = useState(() => getRandomError(errorMessage));

  if (error && search && page === 1) {
    return (
      <Cell xs={12}>
        <InfoScreen
          emoji="❌"
          title={randomData.title}
          description={randomData.description}
        />
      </Cell>
    );
  }

  if (loading) {
    return (
      <Fragment>
        {Array(20)
          .fill(0)
          .map((_x, i) => (
            <Cell key={i} xs={6} sm={4} md={3} xg={2}>
              <Card key={i} loading />
            </Cell>
          ))}
      </Fragment>
    );
  }

  if (data && !data?.results?.length && search !== "" && kindURL === "search") {
    return (
      <Cell xs={12}>
        <InfoScreen
          emoji="😕"
          title={`No results found for ${search}`}
          description="let’s try another one"
        />
      </Cell>
    );
  }

  if (!data?.results?.length) {
    return null;
  }

  const totalPages = data?.total_pages;
  return (
    <Fragment>
      {data?.results?.map((entry) => (
        <Cell key={entry.id} xs={6} sm={4} md={3} xg={2}>
          <Card
            kindURL={
              isKindURLDefined ? kindURL : getDefaultItemType(item_type_query)
            }
            {...entry}
          />
        </Cell>
      ))}
      {isLastPage && totalPages && totalPages > page && (
        <Cell xs={6} sm={4} md={3} xg={2}>
          <Card onClick={() => setPage(page + 1)} loadMore />
          {page > 1 && (
            <div ref={ref}>
              {inView && <InfiniteScroll page={page} setPage={setPage} />}
            </div>
          )}
        </Cell>
      )}
    </Fragment>
  );
};

export default CardsByPage;
