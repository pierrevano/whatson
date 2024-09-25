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
import config from "config";
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
	flex: 1
	display: flex;
	flex-direction: column;
	transition: 0.2s all;
	margin-bottom: ${(p) => (p.error ? 0 : "6rem")};
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
    window.beam(`/custom-events/dailymotion_player_opened/${src}`);
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
 * A component that displays detailed information about a movie or tvshow.
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID of the movie or tvshow.
 * @param {string} props.kindURL - The URL of the kind of media (movie or tvshow).
 * @returns A JSX element that displays the detailed information.
 */
const DetailView = ({ id, kindURL }) => {
  const kind = getKindByURL(kindURL);

  const queryStringParsed = queryString.parse(window.location.search);
  const api_key_query = queryStringParsed.api_key;
  const episodes_details_query = queryStringParsed.episodes_details;
  const ratings_filters_query = queryStringParsed.ratings_filters;

  const [api_key, setApiKey] = useStorageString("api_key", "");
  const [episodes_details, setEpisodesDetails] = useStorageString(
    "episodes_details",
    "",
  );
  const [ratings_filters, setRatingsFilters] = useStorageString(
    "ratings_filters",
    "",
  );
  useEffect(() => {
    if (typeof api_key_query !== "undefined") setApiKey(api_key_query);
    if (typeof episodes_details_query !== "undefined")
      setEpisodesDetails(episodes_details_query);
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
    api_key_query,
    api_key,
    episodes_details_query,
    episodes_details,
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
  const allocine_critics_rating = data_from_render?.allocine?.critics_rating;

  const betaseries_url = data_from_render?.betaseries?.url;
  const betaseries_users_rating = data_from_render?.betaseries?.users_rating;

  const imdb_url = data_from_render?.imdb?.url;
  const imdb_users_rating = data_from_render?.imdb?.users_rating;

  const letterboxd_url = data_from_render?.letterboxd?.url;
  const letterboxd_users_rating = data_from_render?.letterboxd?.users_rating;

  const metacritic_url = data_from_render?.metacritic?.url;
  const metacritic_users_rating = data_from_render?.metacritic?.users_rating;
  const metacritic_critics_rating =
    data_from_render?.metacritic?.critics_rating;

  const rottenTomatoes_url = data_from_render?.rotten_tomatoes?.url;
  const rottenTomatoes_users_rating =
    data_from_render?.rotten_tomatoes?.users_rating;
  const rottenTomatoes_critics_rating =
    data_from_render?.rotten_tomatoes?.critics_rating;

  const senscritique_url = data_from_render?.senscritique?.url;
  const senscritique_users_rating =
    data_from_render?.senscritique?.users_rating;

  const tmdb_url = data_from_render?.tmdb?.url;
  const tmdb_users_rating = data_from_render?.tmdb?.users_rating;

  const trakt_url = data_from_render?.trakt?.url;
  const trakt_users_rating = data_from_render?.trakt?.users_rating;

  const mojo_rank = data_from_render?.mojo?.rank;
  const mojo_url = data_from_render?.mojo?.url;

  const ratings_average = data_from_render?.ratings_average;
  const trailer = data_from_render?.trailer;
  const platforms_links = data_from_render?.platforms_links;
  const status_value = data_from_render?.status;
  const tagline_from_render = data_from_render?.tagline;

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
    image = data?.poster_path || data?.profile_path;
    image = `https://image.tmdb.org/t/p/w1280${image}`;
    placeholder = `https://image.tmdb.org/t/p/w300${image}`;
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

  const itemType = localStorage.getItem("item_type")
    ? localStorage.getItem("item_type")
    : "movie";

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
    betaseries_url,
    betaseries_users_rating,
    imdb_url,
    imdb_users_rating,
    letterboxd_url,
    letterboxd_users_rating,
    metacritic_critics_rating,
    metacritic_url,
    metacritic_users_rating,
    rottenTomatoes_critics_rating,
    rottenTomatoes_url,
    rottenTomatoes_users_rating,
    senscritique_url,
    senscritique_users_rating,
    tmdb_url,
    tmdb_users_rating,
    trakt_url,
    trakt_users_rating,
    mojo_rank,
    mojo_url,
    itemType,
    kindURL,
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
              <Meta status_value={status_value} {...data} />
              <Text weight={600} xs={2} sm={3} md={4} xg={5}>
                {title}
              </Text>
              <div
                className="platform-links"
                style={{
                  display: "flex",
                  margin: "1rem -0.5rem",
                  flexWrap: "wrap",
                  maxWidth: "539px",
                }}
              >
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
                      {itemType === "movie" && (
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
                      url={trailer}
                      playing={true}
                      controls={true}
                      playsinline={true}
                      width="100%"
                      height="100%"
                      onPlay={() => {
                        if (shouldSendCustomEvents()) {
                          window.beam(
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
              </div>
              <Info
                kind={kind}
                tagline_from_render={tagline_from_render}
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
