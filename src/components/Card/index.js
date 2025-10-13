import React, { useRef } from "react";
import styled from "styled-components";
import LazyImage from "react-lazy-progressive-image";
import { useFavoriteState } from "utils/favorites";
import Link from "components/Link";
import AspectRatio from "components/AspectRatio";
import Text from "components/Text";
import { Heart, Movie, Person, TVShow } from "components/Icon";
import { OverlayPanel } from "primereact/overlaypanel";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getRatingsDetails } from "utils/getRatingsDetails";
import { colors } from "../../theme";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";

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
  background: ${(p) => p.theme.colors.overlay};
  box-shadow: 0 0.25rem 2rem 0 rgba(5, 10, 13, 0.3);
  border-radius: 0 0 0.1875rem 0.1875rem;
`;

const OverlayRatings = styled.div`
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  padding: 0.75rem;
  cursor: pointer;
  overflow: hidden;
  opacity: 1;
`;

const InfoRatings = styled.div`
  color: currentColor;
  position: absolute;
  top: 0;
  padding: 0.75rem;
  background: #181818;
  border-radius: 24px;
  margin: 0.6rem;
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

const FavoriteButton = ({ kindURL, id, title }) => {
  const [isFavorite, { toggle }] = useFavoriteState(kindURL + "/" + id);
  return (
    // eslint-disable-next-line no-sequences
    <HeartWrapper
      isFavorite={isFavorite}
      onClick={toggle}
      aria-label={`favorite: ${title}`}
    >
      <StyledHeart filled={isFavorite} />
    </HeartWrapper>
  );
};

const LoadMore = styled(Text)`
  text-align: center;
  height: 100%;
  margin: auto;
  color: ${(p) => p.theme.colors.lightGrey};
  ${Wrapper}:hover & {
    color: ${(p) => p.theme.colors.lightGrey};
  }
`;

const getKindURL = (input) => {
  if (input === "movie") return "movies";
  if (input === "tv") return "tvshows";
  if (input === "person") return "people";
  return input;
};

/**
 * A functional component that renders a card with information about a movie, tvshow, or person.
 * @param {object} props - The props object containing information about the card.
 * @param {string} props.id - The ID of the movie, tvshow, or person.
 * @param {boolean} props.loading - A boolean indicating whether the card is currently loading.
 * @param {boolean} props.error - A boolean indicating whether there was an error loading the card.
 * @param {boolean} props.loadMore - A boolean indicating whether the card should display a "Load More" button.
 * @param {string} props.media_type - The type of media (movie, tvshow, or person).
 * @param
 */
const Card = ({ id, loading, error, loadMore, ...props }) => {
  const kind = props?.media_type;
  const kindURL = getKindURL(props?.media_type) || props.kindURL;

  const title = props?.title || props?.name;

  let image = props?.poster_path || props?.profile_path || props?.image;
  if (image && image.startsWith("/")) {
    image = `https://image.tmdb.org/t/p/w300${image}`;
  }

  const allocine_url = props?.allocine?.url;
  const allocine_users_rating = props?.allocine?.users_rating;
  const allocine_users_rating_count = props?.allocine?.users_rating_count;
  const allocine_critics_rating = props?.allocine?.critics_rating;
  const allocine_critics_rating_count = props?.allocine?.critics_rating_count;

  const betaseries_url = props?.betaseries?.url;
  const betaseries_users_rating = props?.betaseries?.users_rating;
  const betaseries_users_rating_count = props?.betaseries?.users_rating_count;

  const imdb_url = props?.imdb?.url;
  const imdb_users_rating = props?.imdb?.users_rating;
  const imdb_users_rating_count = props?.imdb?.users_rating_count;

  const letterboxd_url = props?.letterboxd?.url;
  const letterboxd_users_rating = props?.letterboxd?.users_rating;
  const letterboxd_users_rating_count = props?.letterboxd?.users_rating_count;

  const mojo_rank = props?.mojo?.rank;
  const mojo_url = props?.mojo?.url;

  const metacritic_url = props?.metacritic?.url;
  const metacritic_users_rating = props?.metacritic?.users_rating;
  const metacritic_users_rating_count = props?.metacritic?.users_rating_count;
  const metacritic_critics_rating = props?.metacritic?.critics_rating;
  const metacritic_critics_rating_count =
    props?.metacritic?.critics_rating_count;

  const rottentomatoes_url = props?.rotten_tomatoes?.url;
  const rottentomatoes_users_rating = props?.rotten_tomatoes?.users_rating;
  const rottentomatoes_users_rating_count =
    props?.rotten_tomatoes?.users_rating_count;
  const rottentomatoes_critics_rating = props?.rotten_tomatoes?.critics_rating;
  const rottentomatoes_critics_rating_count =
    props?.rotten_tomatoes?.critics_rating_count;

  const senscritique_url = props?.senscritique?.url;
  const senscritique_users_rating = props?.senscritique?.users_rating;
  const senscritique_users_rating_count =
    props?.senscritique?.users_rating_count;

  const tmdb_url = props?.tmdb?.url;
  const tmdb_users_rating = props?.tmdb?.users_rating;
  const tmdb_users_rating_count = props?.tmdb?.users_rating_count;

  const trakt_url = props?.trakt?.url;
  const trakt_users_rating = props?.trakt?.users_rating;
  const trakt_users_rating_count = props?.trakt?.users_rating_count;

  const tvtime_url = props?.tv_time?.url;
  const tvtime_users_rating = props?.tv_time?.users_rating;
  const tvtime_users_rating_count = props?.tv_time?.users_rating_count;

  const ratings_average = props?.ratings_average;

  const {
    allocineID,
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
    if (shouldSendCustomEvents()) {
      window.beam?.(`/custom-events/ratings_details_displayed/${allocineID}`);
    }

    if (isMounted.current && detailsData) {
      op.current.hide(e);
      isMounted.current = false;
    } else {
      op.current.show(e);
      isMounted.current = true;
    }
  };

  return (
    <Wrapper error={error} {...props}>
      <AspectRatio ratio={0.75} />
      {!(loading || error || loadMore) && (
        <Anchor
          to={`/${kindURL}/${id}`}
          tabIndex={0}
          ariaLabel={`poster for: ${title}`}
        />
      )}
      <OverflowHidden>
        {image && (
          <LazyImage placeholder={image} src={image}>
            {(src, loading) => (
              <Image
                src={src}
                alt={`poster for: ${title}`}
                loading={+loading}
              />
            )}
          </LazyImage>
        )}
      </OverflowHidden>
      {loadMore && (
        <LoadMore xs={1} weight={500}>
          Load
          <br />
          More
        </LoadMore>
      )}
      <AbsoluteFill>
        {!image && !loading && !loadMore && (
          <NoImage>
            {kind === "movie" && <Movie />}
            {kind === "tvshow" && <TVShow />}
            {kind === "person" && <Person />}
          </NoImage>
        )}
        {!loadMore && (
          <Overlay>
            {title && (
              <Info>
                <Text
                  xs={0}
                  sm={1}
                  weight={500}
                  style={{ marginBottom: "0.25em" }}
                >
                  {title}
                </Text>
              </Info>
            )}
            <div style={{ display: "flex", alignItems: "center" }}>
              {id && <FavoriteButton kindURL={kindURL} id={id} title={title} />}
            </div>
          </Overlay>
        )}
        {!loadMore && (
          <OverlayRatings>
            {ratings_average > 0 && (
              <InfoRatings
                className="rating_details"
                onClick={displayRatingsDetails}
              >
                <span style={{ color: colors.green }}>★</span>{" "}
                {ratings_average.toFixed(1)}
                <OverlayPanel ref={op}>
                  <DataTable value={detailsData} size="small">
                    <Column body={logoBody} />
                    <Column
                      header="Name"
                      body={nameBody}
                      style={{ minWidth: "11rem" }}
                    />
                    <Column field="rating" header="Rating" body={ratingBody} />
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
              </InfoRatings>
            )}
          </OverlayRatings>
        )}
      </AbsoluteFill>
    </Wrapper>
  );
};

export default Card;
