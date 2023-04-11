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
import TrailerButton from "components/TrailerButton";
import InfoScreen from "components/InfoScreen";
import Meta from "./Meta";
import Info from "./Info";
import Image from "./Image";
import { getLanguage } from "utils/useLanguage";
import queryString from "query-string";
import { useStorageString } from "utils/useStorageString";
import { getParameters } from "utils/getParameters";
import config from "utils/config";
import { Dialog } from "primereact/dialog";
import ReactPlayer from "react-player";
import PlatformLinks from "components/PlatformLinks";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getRatingsDetails } from "utils/getRatingsDetails";

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
  padding: 0.75rem 1rem 0.75rem 0.5rem;
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

const getDetailTitle = (kindURL, title) => `${getTitleFromURL(kindURL)} ${title ? ` - ${title}` : ""}`;

/**
 * A component that displays detailed information about a movie or TV show.
 * @param {Object} props - The props object.
 * @param {string} props.id - The ID of the movie or TV show.
 * @param {string} props.kindURL - The URL of the kind of media (movie or TV show).
 * @returns A JSX element that displays the detailed information.
 */
const DetailView = ({ id, kindURL }) => {
  const kind = getKindByURL(kindURL);

  const base = config.base;
  const api = config.api;

  const cors_url = config.cors_url;
  const base_render = config.base_render;

  const queryStringParsed = queryString.parse(window.location.search);
  let ratings_filters_query = queryStringParsed.ratings_filters;

  const [ratings_filters, setRatingsFilters] = useStorageString("ratings_filters", "");
  useEffect(() => {
    if (typeof ratings_filters_query !== "undefined") setRatingsFilters(ratings_filters_query);
  });

  const parameters = getParameters("", undefined, "", undefined, ratings_filters, ratings_filters_query, "", undefined);

  const { data: data_from_render } = useFetch([`${cors_url}${base_render}/${kind}/${id}`, `${parameters}`].join(""));

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

  const ratings_average = data_from_render?.ratings_average;
  const trailer = data_from_render?.trailer;
  const platforms_links = data_from_render?.platforms_links;

  const { error, loading, data } = useFetch([`${base}/${kind}/${id}`, `?api_key=${api}`, `&append_to_response=release_dates,external_ids,credits,content_ratings`, `&language=${getLanguage()}`].join(""));

  const title = data?.title || data?.name;

  if (kind === "person" || (image && image.startsWith("/"))) {
    image = data?.poster_path || data?.profile_path;
    image = `https://image.tmdb.org/t/p/w1280${image}`;
    placeholder = `https://image.tmdb.org/t/p/w300${image}`;
  }

  useEffect(
    () => {
      document.title = getDetailTitle(kindURL, title);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const errorMessage = [
    { title: "I’m sorry Dave.", description: "I’m afraid I can’t do that." },
    { title: "Into exile I must go.", description: "Failed I have." },
    { title: "Well, if I I've made a mistake,", description: "I'm sorry and I hope you'll forgive me." },
  ];

  const getRandomError = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const [randomData] = useState(() => getRandomError(errorMessage));

  const [visiblePopup, setVisiblePopup] = useState(false);

  const dialogMaskBackground = (visibleMask) => {
    setTimeout(() => {
      const parentNodeClasslist = document.getElementById("dialog-player").parentNode.classList;
      visibleMask ? parentNodeClasslist.add("p-component-overlay-enter") : parentNodeClasslist.remove("p-component-overlay-enter");
    }, 100);
  };

  const setVisiblePopupAndDialogMaskBackground = () => {
    setVisiblePopup(true);
    dialogMaskBackground(true);
  };

  const { detailsData, logoBody, nameBody, ratingBody } = getRatingsDetails(allocine_url, betaseries_url, imdb_url, allocine_users_rating, allocine_critics_rating, betaseries_users_rating, imdb_users_rating);

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
              <Meta {...data} />
              <Text weight={600} xs={2} sm={3} md={4} xg={5}>
                {title}
              </Text>
              <div style={{ display: "flex", margin: "1rem -0.5rem", flexWrap: "wrap", maxWidth: "539px" }}>
                {!!allocine && (
                  <Button displayRatingsDetails={displayRatingsDetails} background="#28A745" logo={<Star size={11} filled={true} color="#181818" />}>
                    {!!ratings_average && `${ratings_average.toFixed(2)}/5`}
                    <OverlayPanel ref={op}>
                      <DataTable value={detailsData} size="small">
                        <Column body={logoBody} />
                        <Column header="Name" body={nameBody} style={{ minWidth: "11rem" }} />
                        <Column field="rating" header="Rating" body={ratingBody} />
                      </DataTable>
                    </OverlayPanel>
                  </Button>
                )}
                <ToggleButton kindURL={kindURL} id={id} />
                {!!trailer && <TrailerButton kindURL={kindURL} setVisiblePopupAndDialogMaskBackground={setVisiblePopupAndDialogMaskBackground} />}
                <Dialog
                  id="dialog-player"
                  header="Trailer"
                  visible={visiblePopup}
                  onHide={() => {
                    setVisiblePopup(false);
                    dialogMaskBackground(false);
                  }}
                >
                  <ReactPlayer url={trailer} playing={true} controls={true} playsinline={true} width="100%" height="100%" />
                </Dialog>
                {platforms_links?.map((platform) => (
                  <PlatformLinks name={platform.name} linkURL={platform.link_url} />
                ))}
              </div>
              <Info kind={kind} {...data} />
            </Cell>
            <Cell xs={12} sm={12} md={5} lg={5}>
              <Image kind={kind} alt={`poster for: ${title}`} image={image} placeholder={placeholder} />
            </Cell>
          </Row>
        )}
      </Container>
      {error && (
        <Container style={{ flex: 1 }}>
          <InfoScreen emoji="❌" title={randomData.title} description={randomData.description} />
        </Container>
      )}
    </Wrapper>
  );
};

export default DetailView;
