import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useFetch } from "react-hooks-fetch";
import { Row, Cell } from "griding";
import { getTitleFromURL, getKindByURL } from "utils/kind";
import Container from "components/Container";
import Loader from "components/Loader";
import { Arrow, Star } from "components/Icon";
import Text from "components/Text";
import Button from "components/Button";
import ToggleButton from "components/ToggleButton";
import DialogButton from "components/DialogButton";
import InfoScreen from "components/InfoScreen";
import Meta from "./Meta";
import Info from "./Info";
import Image from "./Image";
import { getLanguage } from "utils/useLanguage";
import queryString from "query-string";
import { useStorageString } from "utils/useStorageString";
import { getParameters } from "utils/getParameters";
import config from "../../config";
import { Dialog } from "primereact/dialog";
import ReactPlayer from "react-player";
import PlatformLinks from "components/PlatformLinks";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getRatingsDetails } from "utils/getRatingsDetails";
import RatingsChart from "./RatingsChart";
import { colors } from "../../theme";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: 0.2s all;
  margin-bottom: ${(p) => (p.error ? 0 : "6rem")};
`;

const PlatformLinksGroup = styled.div.attrs({ className: "platform-links" })`
  display: flex;
  flex-wrap: wrap;
  max-width: 539px;
  margin: 1rem 0;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
`;

const BackLink = styled.button`
  background: ${(p) => p.theme.colors.dark};
  border: none;
  display: inline-block;
  appearance: none;
  color: ${(p) => p.theme.colors.lightGrey};
  cursor: pointer;
  border-radius: 0.25rem;
  margin: 0 -0.5rem;
  padding: 1.5rem 1rem 0.75rem 0.5rem;
  @media (max-width: 767px) {
    padding-top: 1.2rem;
  }
  position: sticky;
  top: 0.25rem;
  z-index: 2;
  &:hover {
    color: ${(p) => p.theme.colors.white};
  }
  &:focus {
    box-shadow: inset 0 0 0 0.125rem ${(p) => p.theme.colors.green};
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    box-shadow: 0 0 4rem ${(p) => p.theme.colors.dark};
  }
`;

const getDetailTitle = (kindURL, title) =>
  `${getTitleFromURL(kindURL)} ${title ? ` - ${title}` : ""}`;

const Player = ({ src, ...rest }) => {
  if (shouldSendCustomEvents()) {
    window.beam?.(`/custom-events/dailymotion_player_opened/${src}`);
  }

  const dailymotionPlayer = "dailymotionPlayer";
  const dataVideo = rest["data-video"];

  useEffect(() => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;

    script.setAttribute("data-video", dataVideo);

    const divElement = document.getElementById(dailymotionPlayer);
    divElement.appendChild(script);

    return () => {
      if (document.contains(script)) divElement.removeChild(script);
    };
  }, [src, dataVideo]);

  return <div id={dailymotionPlayer}></div>;
};

/**
 * Displays an entity detail panel fetched from the render API, including ratings,
 * trailers, and related platform links for movies, TV shows, or people.
 * @param {Object} props - Component props.
 * @param {string} props.id - Identifier of the requested entity.
 * @param {string} props.kindURL - Route segment describing the entity type.
 * @returns {JSX.Element} Rich detail view for the selected entity.
 */
const DetailView = ({ id, kindURL }) => {
  const kind = getKindByURL(kindURL);

  const queryStringParsed = queryString.parse(window.location.search);
  const api_key_query = queryStringParsed.api_key;
  const ratings_filters_query = queryStringParsed.ratings_filters;

  const [api_key, setApiKey] = useStorageString("api_key", "");
  const [ratings_filters, setRatingsFilters] = useStorageString(
    "ratings_filters",
    "",
  );
  useEffect(() => {
    if (typeof api_key_query !== "undefined") setApiKey(api_key_query);
    if (typeof ratings_filters_query !== "undefined")
      setRatingsFilters(ratings_filters_query);
  });

  const parameters = getParameters(
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    undefined,
    "",
    api_key_query,
    api_key,
    undefined,
    "episodes_details,last_episode,next_episode,highest_episode,lowest_episode",
    ratings_filters_query,
    ratings_filters,
  );

  const { data: data_from_render } = useFetch(
    [
      `${config.base_render_api}/${getKindByURL(kindURL, "render")}${kindURL !== "people" ? `/${id}` : ""}`,
      `${parameters}`,
    ].join(""),
  );

  let image = data_from_render?.image;
  let placeholder = image;

  const allocine = data_from_render?.allocine?.id;

  const allocine_url = data_from_render?.allocine?.url;
  const allocine_users_rating = data_from_render?.allocine?.users_rating;
  const allocine_users_rating_count =
    data_from_render?.allocine?.users_rating_count;
  const allocine_critics_rating = data_from_render?.allocine?.critics_rating;
  const allocine_critics_rating_count =
    data_from_render?.allocine?.critics_rating_count;

  const betaseries_url = data_from_render?.betaseries?.url;
  const betaseries_users_rating = data_from_render?.betaseries?.users_rating;
  const betaseries_users_rating_count =
    data_from_render?.betaseries?.users_rating_count;

  const imdb_url = data_from_render?.imdb?.url;
  const imdb_users_rating = data_from_render?.imdb?.users_rating;
  const imdb_users_rating_count = data_from_render?.imdb?.users_rating_count;

  const letterboxd_url = data_from_render?.letterboxd?.url;
  const letterboxd_users_rating = data_from_render?.letterboxd?.users_rating;
  const letterboxd_users_rating_count =
    data_from_render?.letterboxd?.users_rating_count;

  const metacritic_url = data_from_render?.metacritic?.url;
  const metacritic_users_rating = data_from_render?.metacritic?.users_rating;
  const metacritic_users_rating_count =
    data_from_render?.metacritic?.users_rating_count;
  const metacritic_critics_rating =
    data_from_render?.metacritic?.critics_rating;
  const metacritic_critics_rating_count =
    data_from_render?.metacritic?.critics_rating_count;

  const rottentomatoes_url = data_from_render?.rotten_tomatoes?.url;
  const rottentomatoes_users_rating =
    data_from_render?.rotten_tomatoes?.users_rating;
  const rottentomatoes_users_rating_count =
    data_from_render?.rotten_tomatoes?.users_rating_count;
  const rottentomatoes_critics_rating =
    data_from_render?.rotten_tomatoes?.critics_rating;
  const rottentomatoes_critics_rating_count =
    data_from_render?.rotten_tomatoes?.critics_rating_count;

  const senscritique_url = data_from_render?.senscritique?.url;
  const senscritique_users_rating =
    data_from_render?.senscritique?.users_rating;
  const senscritique_users_rating_count =
    data_from_render?.senscritique?.users_rating_count;

  const tmdb_url = data_from_render?.tmdb?.url;
  const tmdb_users_rating = data_from_render?.tmdb?.users_rating;
  const tmdb_users_rating_count = data_from_render?.tmdb?.users_rating_count;

  const trakt_url = data_from_render?.trakt?.url;
  const trakt_users_rating = data_from_render?.trakt?.users_rating;
  const trakt_users_rating_count = data_from_render?.trakt?.users_rating_count;

  const tvtime_url = data_from_render?.tv_time?.url;
  const tvtime_users_rating = data_from_render?.tv_time?.users_rating;
  const tvtime_users_rating_count =
    data_from_render?.tv_time?.users_rating_count;

  const mojo_rank = data_from_render?.mojo?.rank;
  const mojo_url = data_from_render?.mojo?.url;

  const certification_from_render = data_from_render?.certification;
  const platforms_links = data_from_render?.platforms_links;
  const ratings_average = data_from_render?.ratings_average;
  const runtime_from_render = data_from_render?.runtime;
  const seasons_number_from_render = data_from_render?.seasons_number;
  const status_from_render = data_from_render?.status;
  const tagline_from_render = data_from_render?.tagline;
  const trailer = data_from_render?.trailer;

  const episodes_details_values = data_from_render?.episodes_details || [];
  const usersRatings = episodes_details_values
    .map((ep) => ep && ep.users_rating)
    .filter((rating) => rating !== null);
  const episodeDetails = episodes_details_values
    .map((ep) => ({
      season: ep && ep.season,
      episode: ep && ep.episode,
    }))
    .filter((detail) => detail.season !== null && detail.episode !== null);
  const titles = episodes_details_values
    .map((ep) => ep && ep.title)
    .filter((el) => el !== null);

  const next_episode_from_render = data_from_render?.next_episode;
  const last_episode_from_render = data_from_render?.last_episode;
  const highest_episode_from_render = data_from_render?.highest_episode;
  const lowest_episode_from_render = data_from_render?.lowest_episode;

  const { error, loading, data } = useFetch(
    [
      `${config.base}/${kind}/${id}`,
      `?api_key=${config.api}`,
      `&append_to_response=release_dates,external_ids,credits,content_ratings`,
      `&language=${getLanguage()}`,
    ].join(""),
  );

  const title = data?.title || data?.name;

  if (kind === "person" || (image && image.startsWith("/"))) {
    const fallbackPath = data?.poster_path || data?.profile_path;
    if (fallbackPath) {
      image = `https://image.tmdb.org/t/p/w1280${fallbackPath}`;
      placeholder = `https://image.tmdb.org/t/p/w300${fallbackPath}`;
    } else {
      image = undefined;
      placeholder = undefined;
    }
  }

  useEffect(() => {
    document.title = getDetailTitle(kindURL, title);
  }, [data, kindURL, title]);

  const errorMessage = [
    { title: "I’m sorry Dave.", description: "I’m afraid I can’t do that." },
    { title: "Into exile I must go.", description: "Failed I have." },
    {
      title: "Well, if I I've made a mistake,",
      description: "I'm sorry and I hope you'll forgive me.",
    },
  ];

  const getRandomError = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const [randomData] = useState(() => getRandomError(errorMessage));

  const [visiblePopup, setVisiblePopup] = useState(false);
  const [visiblePopupChart, setVisiblePopupChart] = useState(false);

  const updateDialogMaskBackground = (dialogId, visibleMask) => {
    setTimeout(() => {
      const parentNodeClasslist =
        document.getElementById(dialogId)?.parentNode?.classList;
      if (parentNodeClasslist) {
        visibleMask
          ? parentNodeClasslist.add("p-component-overlay-enter")
          : parentNodeClasslist.remove("p-component-overlay-enter");
      }
    }, 100);
  };

  const dialogMaskBackground = (visibleMask) =>
    updateDialogMaskBackground("dialog-player", visibleMask);
  const dialogMaskBackgroundChart = (visibleMask) =>
    updateDialogMaskBackground("dialog-chart", visibleMask);

  const setValues = () => {
    setVisiblePopup(true);
    dialogMaskBackground(true);
  };
  const setValuesChart = () => {
    setVisiblePopupChart(true);
    dialogMaskBackgroundChart(true);
  };

  const {
    detailsData,
    mojoDetailsData,
    logoBody,
    nameBody,
    ratingBody,
    rankBody,
  } = getRatingsDetails(
    allocine_critics_rating,
    allocine_url,
    allocine_users_rating,
    allocine_users_rating_count,
    allocine_critics_rating_count,
    betaseries_url,
    betaseries_users_rating,
    betaseries_users_rating_count,
    imdb_url,
    imdb_users_rating,
    imdb_users_rating_count,
    letterboxd_url,
    letterboxd_users_rating,
    letterboxd_users_rating_count,
    metacritic_critics_rating,
    metacritic_url,
    metacritic_users_rating,
    metacritic_users_rating_count,
    metacritic_critics_rating_count,
    rottentomatoes_critics_rating,
    rottentomatoes_url,
    rottentomatoes_users_rating,
    rottentomatoes_users_rating_count,
    rottentomatoes_critics_rating_count,
    senscritique_url,
    senscritique_users_rating,
    senscritique_users_rating_count,
    tmdb_url,
    tmdb_users_rating,
    tmdb_users_rating_count,
    trakt_url,
    trakt_users_rating,
    trakt_users_rating_count,
    tvtime_url,
    tvtime_users_rating,
    tvtime_users_rating_count,
    mojo_rank,
    mojo_url,
  );

  const op = useRef(null);
  const isMounted = useRef(false);

  const displayRatingsDetails = (e) => {
    if (isMounted.current && detailsData) {
      op.current.hide(e);
      isMounted.current = false;
    } else {
      op.current.show(e);
      isMounted.current = true;
    }
  };

  return (
    <Wrapper error={error}>
      <Container>
        {loading && <Loader />}
        {!loading && data && (
          <Row vertical-gutter style={{ justifyContent: "space-between" }}>
            <Cell xs={12} md={6} style={{ marginBottom: "1.5rem" }}>
              <BackLink onClick={() => window.history.back()}>
                <Arrow />
              </BackLink>
              <Meta
                certification_from_render={certification_from_render}
                runtime_from_render={runtime_from_render}
                seasons_number_from_render={seasons_number_from_render}
                status_from_render={status_from_render}
                {...data}
              />
              <Text weight={600} xs={2} sm={3} md={4} xg={5}>
                {title}
              </Text>
              <PlatformLinksGroup>
                {!!allocine && (
                  <Button
                    displayRatingsDetails={displayRatingsDetails}
                    background={colors.green}
                    logo={<Star size={11} filled={true} color={colors.dark} />}
                  >
                    {!!ratings_average && `${ratings_average.toFixed(2)}/5`}
                    <OverlayPanel ref={op}>
                      <DataTable value={detailsData} size="small">
                        <Column body={logoBody} />
                        <Column
                          header="Name"
                          body={nameBody}
                          style={{ minWidth: "11rem" }}
                        />
                        <Column
                          field="rating"
                          header="Rating"
                          body={ratingBody}
                        />
                      </DataTable>
                      {mojoDetailsData.length > 0 && (
                        <DataTable value={mojoDetailsData} size="small">
                          <Column body={logoBody} />
                          <Column
                            header="-"
                            body={nameBody}
                            style={{ minWidth: "11rem" }}
                          />
                          <Column field="rank" header="Rank" body={rankBody} />
                        </DataTable>
                      )}
                    </OverlayPanel>
                  </Button>
                )}
                <ToggleButton kindURL={kindURL} id={id} />
                {!!trailer && (
                  <DialogButton setValues={setValues} itemKey="trailer" />
                )}
                <Dialog
                  id="dialog-player"
                  header="Trailer"
                  visible={visiblePopup}
                  onHide={() => {
                    setVisiblePopup(false);
                    dialogMaskBackground(false);
                  }}
                >
                  {trailer && trailer.includes("dailymotion") ? (
                    <Player
                      src="https://geo.dailymotion.com/player/xow6u.js"
                      data-video={trailer.split("/").pop()}
                    />
                  ) : (
                    <ReactPlayer
                      src={trailer}
                      playing={true}
                      controls={true}
                      playsInline={true}
                      width="100%"
                      height="100%"
                      onPlay={() => {
                        if (shouldSendCustomEvents()) {
                          window.beam?.(
                            `/custom-events/native_player_opened/${trailer}`,
                          );
                        }
                      }}
                    />
                  )}
                </Dialog>
                {platforms_links?.length > 0 &&
                  platforms_links.map((platform) => (
                    <PlatformLinks
                      key={platform.name}
                      name={platform.name}
                      linkURL={platform.link_url}
                    />
                  ))}
                {usersRatings?.length > 0 &&
                  episodeDetails?.length > 0 &&
                  titles?.length > 0 && (
                    <>
                      <DialogButton
                        setValues={setValuesChart}
                        itemKey="chart"
                      />
                      <Dialog
                        id="dialog-chart"
                        header="IMDb episodes users ratings"
                        visible={visiblePopupChart}
                        onHide={() => {
                          setVisiblePopupChart(false);
                          dialogMaskBackgroundChart(false);
                        }}
                      >
                        <RatingsChart
                          ratings={usersRatings}
                          episodeDetails={episodeDetails}
                          titles={titles}
                          allocineUrl={allocine_url}
                        />
                      </Dialog>
                    </>
                  )}
              </PlatformLinksGroup>
              <Info
                kind={kind}
                tagline_from_render={tagline_from_render}
                next_episode_from_render={next_episode_from_render}
                last_episode_from_render={last_episode_from_render}
                highest_episode_from_render={highest_episode_from_render}
                lowest_episode_from_render={lowest_episode_from_render}
                {...data}
              />
            </Cell>
            <Cell xs={12} sm={12} md={5} lg={5}>
              <Image
                kind={kind}
                alt={`poster for: ${title}`}
                image={image}
                placeholder={placeholder}
              />
            </Cell>
          </Row>
        )}
      </Container>
      {error && (
        <Container style={{ flex: 1 }}>
          <InfoScreen
            emoji="❌"
            title={randomData.title}
            description={randomData.description}
          />
        </Container>
      )}
    </Wrapper>
  );
};

export default DetailView;
