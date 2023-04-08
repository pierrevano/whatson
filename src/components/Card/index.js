import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import LazyImage from "react-lazy-progressive-image";
import { useFavoriteState } from "utils/favorites";
import Link from "components/Link";
import AspectRatio from "components/AspectRatio";
import Text from "components/Text";
import { Heart, Movie, Person, TV } from "components/Icon";
import { OverlayPanel } from "primereact/overlaypanel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getRatingsDetails } from "utils/getRatingsDetails";

const Wrapper = styled.div`
  background: none;
  border: none;
  margin: 0;
  flex: 1;
  display: flex;
  position: relative;
  background: ${(p) => (p.error ? p.theme.colors.red : p.theme.colors.grey)};
  border-radius: 0.1875rem;
  cursor: pointer;
`;

const fill = `position: absolute; top: 0; bottom: 0; left: 0; right: 0;`;

const Anchor = styled(Link)`
  appearance: none;
  width: 100%;
  color: currentColor;
  display: block;
  border-radius: 0.1875rem;
  z-index: 1;
  ${fill}
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
`;

const AbsoluteFill = styled.div`
  ${fill}
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
`;

const OverflowHidden = styled(AbsoluteFill)`
  overflow: hidden;
  border-radius: 0.1875rem;
`;

const Image = styled.img`
  display: block;
  min-height: 100%;
  object-fit: cover;
  transition: 0.2s all;
`;

const Overlay = styled.div`
  width: 100%;
  margin-top: auto;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  background: none;
  box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  border-radius: 0 0 0.1875rem 0.1875rem;
  @media (hover: hover) {
    border-radius: 0.1875rem;
    height: 100%;
    background: none;
    box-shadow: none;
  }
  ${Wrapper}:hover &, ${Wrapper}:focus-within & {
    background: none;
    box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  }
`;

const HeartWrapper = styled.button`
  background: none;
  border: none;
  margin: 0;
  color: currentColor;
  top: 0;
  right: 0;
  left: auto;
  padding: 0.75rem;
  cursor: pointer;
  z-index: 1;
  position: absolute;
  @media (hover: hover) {
    margin-left: auto;
    opacity: ${(p) => (p.isFavorite ? 1 : 0)};
  }
  ${Wrapper}:hover &, ${Wrapper}:focus-within & {
    opacity: 1;
  }
`;

const StyledHeart = styled(Heart)`
  transition: 0.2s all;
  ${HeartWrapper}:focus &, ${HeartWrapper}:hover & {
    color: ${(p) => p.theme.colors.red};
  }
`;

const Info = styled.div`
  color: currentColor;
  position: absolute;
  top: 0;
  padding: 0.75rem;
  background: #181818;
  border-radius: 24px;
  margin: 7px;
  padding: 5px;
  width: 60px;
  text-align: center;
  font-weight: bold;
`;

const NoImage = styled.div`
  ${fill}
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${(p) => p.theme.colors.midGrey};
`;

const FavoriteButton = ({ kindURL, id }) => {
  const [isFavorite, { toggle }] = useFavoriteState(kindURL + "/" + id);
  return (
    // eslint-disable-next-line no-sequences
    <HeartWrapper isFavorite={isFavorite} onClick={toggle}>
      <StyledHeart filled={isFavorite} />
    </HeartWrapper>
  );
};

const LoadMore = styled(Text)`
  text-align: center;
  height: 100%;
  margin: auto;
  ${Wrapper}:hover & {
    color: ${(p) => p.theme.colors.lightGrey};
  }
`;

const getKindURL = (input) => {
  if (input === "movie") return "movies";
  if (input === "person") return "people";
  return input;
};

/**
 * A functional component that renders a card with information about a movie, TV show, or person.
 * @param {object} props - The props object containing information about the card.
 * @param {string} props.id - The ID of the movie, TV show, or person.
 * @param {boolean} props.loading - A boolean indicating whether the card is currently loading.
 * @param {boolean} props.error - A boolean indicating whether there was an error loading the card.
 * @param {boolean} props.loadMore - A boolean indicating whether the card should display a "Load More" button.
 * @param {string} props.media_type - The type of media (movie, TV show, or person).
 * @param
 */
const Card = ({ id, loading, error, loadMore, ...props }) => {
  const kind = props?.media_type;
  const kindURL = getKindURL(props?.media_type) || props.kindURL;

  const title = props?.title;

  let image = props?.poster_path || props?.profile_path || props?.image;
  let placeholder = props?.placeholder;
  if (image && image.startsWith("/")) {
    image = `https://image.tmdb.org/t/p/w300${image}`;
    placeholder = `https://image.tmdb.org/t/p/w300${image}`;
  }

  const allocine_url = props?.allocine?.url;
  const allocine_users_rating = props?.allocine?.users_rating;
  const allocine_critics_rating = props?.allocine?.critics_rating;

  const betaseries_url = props?.betaseries?.url;
  const betaseries_users_rating = props?.betaseries?.users_rating;

  const imdb_url = props?.imdb?.url;
  const imdb_users_rating = props?.imdb?.users_rating;

  const ratings_average = props?.ratings_average;

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

  const [height, setHeight] = useState(750);
  const [width, setWidth] = useState(500);
  const imgEl = useRef(null);

  useEffect(() => {
    if (imgEl.current) {
      setHeight(imgEl.current.clientHeight);
      setWidth(imgEl.current.clientWidth);
    }
  }, [imgEl, placeholder]);

  return (
    <Wrapper error={error} {...props}>
      <AspectRatio ratio={0.75} />
      {!(loading || error || loadMore) && <Anchor to={`/${kindURL}/${id}`} tabIndex={0} />}
      <OverflowHidden>
        {image && (
          <LazyImage placeholder={placeholder} src={placeholder}>
            {(src, loading) => <Image ref={imgEl} src={src} alt={`poster for: ${title}`} height={height} width={width} loading={+loading} />}
          </LazyImage>
        )}
      </OverflowHidden>
      {loadMore && (
        <LoadMore xs={1} weight={500} color={(p) => p.theme.colors.midGrey}>
          Load
          <br />
          More
        </LoadMore>
      )}
      <AbsoluteFill>
        {!image && !loading && !loadMore && (
          <NoImage>
            {kind === "movie" && <Movie />}
            {kind === "tv" && <TV />}
            {kind === "person" && <Person />}
          </NoImage>
        )}
        {!loadMore && (
          <Overlay>
            {ratings_average > 0 && (
              <Info className="rating_details" onClick={displayRatingsDetails}>
                <span style={{ color: "#28A745" }}>★</span> {ratings_average.toFixed(1)}
                <OverlayPanel ref={op}>
                  <DataTable value={detailsData} size="small">
                    <Column body={logoBody} />
                    <Column header="Name" body={nameBody} style={{ minWidth: "11rem" }} />
                    <Column field="rating" header="Rating" body={ratingBody} />
                  </DataTable>
                </OverlayPanel>
              </Info>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>{id && <FavoriteButton kindURL={kindURL} id={id} />}</div>
          </Overlay>
        )}
      </AbsoluteFill>
    </Wrapper>
  );
};

export default Card;
