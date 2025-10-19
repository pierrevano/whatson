import React, { Fragment, useEffect, useState } from "react";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";
import { useInView } from "react-intersection-observer";
import { Cell } from "griding";
import { getKindByURL } from "utils/kind";
import Card from "components/Card";
import InfoScreen from "components/InfoScreen";
import queryString from "query-string";
import { useStorageString } from "utils/useStorageString";
import { getParameters } from "utils/getParameters";
import config from "../../config";

const queryStringParsed = queryString.parse(window.location.search);
const api_key_query = queryStringParsed.api_key;
const genres_query = queryStringParsed.genres;
const is_active_query = queryStringParsed.is_active;
const item_type_query = queryStringParsed.item_type;
const minimum_ratings_query = queryStringParsed.minimum_ratings;
const must_see_query = queryStringParsed.must_see;
const platforms_query = queryStringParsed.platforms;
const popularity_filters_query = queryStringParsed.popularity_filters;
const top_ranking_order_query = queryStringParsed.top_ranking_order;
const mojo_rank_order_query = queryStringParsed.mojo_rank_order;
const ratings_filters_query = queryStringParsed.ratings_filters;
const release_date_query = queryStringParsed.release_date;
const runtime_query = queryStringParsed.runtime;
const seasons_number_query = queryStringParsed.seasons_number;
const status_query = queryStringParsed.status;

const getDataURL = (
  api_key,
  genres,
  is_active,
  item_type,
  kindURL,
  minimum_ratings,
  must_see,
  page,
  platforms,
  popularity_filters,
  top_ranking_order,
  mojo_rank_order,
  ratings_filters,
  release_date,
  runtime,
  search,
  seasons_number,
  status,
) => {
  const parameters = getParameters(
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
  const [is_active, setIsActive] = useStorageString(
    "is_active",
    config.is_active,
  );
  const [item_type, setItemType] = useStorageString(
    "item_type",
    config.item_type,
  );
  const [minimum_ratings_value, setMinRatingsValue] = useStorageString(
    "minimum_ratings",
    "",
  );
  const [must_see_value, setMustSeeValue] = useStorageString("must_see", "");
  const [platforms_value, setPlatformsValue] = useStorageString(
    "platforms",
    "",
  );
  const [popularity_filters, setPopularityFilters] = useStorageString(
    "popularity_filters",
    "",
  );
  const [top_ranking_order, setTopRankingOrder] = useStorageString(
    "top_ranking_order",
    "",
  );
  const [mojo_rank_order, setMojoRankOrder] = useStorageString(
    "mojo_rank_order",
    "",
  );
  const [ratings_filters, setRatingsFilters] = useStorageString(
    "ratings_filters",
    "",
  );
  const [release_date, setReleaseDate] = useStorageString(
    "release_date",
    config.release_date,
  );
  const [runtime_value, setRuntimeValue] = useStorageString("runtime", "");
  const [seasons_number, setSeasonsNumber] = useStorageString(
    "seasons_number",
    "",
  );
  const [status_value, setStatusValue] = useStorageString("status", "");

  useEffect(() => {
    if (typeof api_key_query !== "undefined") setApiKey(api_key_query);
    if (typeof genres_query !== "undefined") setGenresValue(genres_query);
    if (typeof is_active_query !== "undefined") setIsActive(is_active_query);
    if (typeof item_type_query !== "undefined") setItemType(item_type_query);
    if (typeof minimum_ratings_query !== "undefined")
      setMinRatingsValue(minimum_ratings_query);
    if (typeof must_see_query !== "undefined") setMustSeeValue(must_see_query);
    if (typeof platforms_query !== "undefined")
      setPlatformsValue(platforms_query);
    if (typeof popularity_filters_query !== "undefined")
      setPopularityFilters(popularity_filters_query);
    if (typeof top_ranking_order_query !== "undefined")
      setTopRankingOrder(top_ranking_order_query);
    if (typeof mojo_rank_order_query !== "undefined")
      setMojoRankOrder(mojo_rank_order_query);
    if (typeof ratings_filters_query !== "undefined")
      setRatingsFilters(ratings_filters_query);
    if (typeof release_date_query !== "undefined")
      setReleaseDate(release_date_query);
    if (typeof runtime_query !== "undefined") setRuntimeValue(runtime_query);
    if (typeof seasons_number_query !== "undefined")
      setSeasonsNumber(seasons_number_query);
    if (typeof status_query !== "undefined") setStatusValue(status_query);
  }, [
    setGenresValue,
    setIsActive,
    setItemType,
    setMinRatingsValue,
    setMustSeeValue,
    setPlatformsValue,
    setPopularityFilters,
    setTopRankingOrder,
    setMojoRankOrder,
    setRatingsFilters,
    setReleaseDate,
    setRuntimeValue,
    setSeasonsNumber,
    setStatusValue,
  ]);

  const fetchUrl = getDataURL(
    api_key,
    genres_value,
    is_active,
    item_type,
    kindURL,
    minimum_ratings_value,
    must_see_value,
    page,
    platforms_value,
    popularity_filters,
    top_ranking_order,
    mojo_rank_order,
    ratings_filters,
    release_date,
    runtime_value,
    search,
    seasons_number,
    status_value,
  );

  const isKindURLDefined =
    kindURL === "movies" ||
    kindURL === "people" ||
    kindURL === "search" ||
    kindURL === "tvshows";

  const { data, error, isLoading: loading } = useFetchWithStatusCode(fetchUrl);

  const [ref, inView] = useInView();

  const getItemType = (item_type) => {
    if (item_type === "tvshow") return "tvshows";
    if (item_type === "movie") return "movies";
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

  if (
    data &&
    !data?.results?.length &&
    search !== "" &&
    kindURL === "search" &&
    page === 1
  ) {
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

  const toPopularityScore = (value) => {
    if (typeof value === "number") {
      return Number.isFinite(value) ? value : -Infinity;
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : -Infinity;
  };

  const sortedResults = [...data.results].sort(
    (first, second) =>
      toPopularityScore(second?.popularity) -
      toPopularityScore(first?.popularity),
  );

  const totalPages = data?.total_pages;
  return (
    <Fragment>
      {sortedResults.map((entry) => (
        <Cell key={entry.id} xs={6} sm={4} md={3} xg={2}>
          <Card
            kindURL={isKindURLDefined ? kindURL : getItemType(entry.item_type)}
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
