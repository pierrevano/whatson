import { colors } from "../../theme";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { getKindByURL } from "utils/kind";
import { getRatingsDetails } from "utils/getRatingsDetails";
import { OverlayPanel } from "primereact/overlaypanel";
import { trackAnalyticsEvent } from "utils/analytics";
import { useRef } from "react";
import config from "../../config";
import styled from "styled-components";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";

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

/**
 * Star-rating pastille shown on cards, with a click-to-open panel detailing
 * the per-source ratings. Items that only carry raw TMDB fields are enriched
 * from the What's On API, falling back to the TMDB rating.
 * @param {Object} props - Source data describing the rated entity.
 * @param {string} props.id - Identifier for the rated entity.
 * @param {string} [props.kindURL] - URL kind used to build the TMDB link.
 * @returns {JSX.Element|null} The rating pastille, or null without a rating.
 */
const RatingBadge = ({ id, kindURL, ...props }) => {
  const renderKind = getKindByURL(kindURL, "render");
  const { data: fetched } = useFetchWithStatusCode(
    !(props?.ratings_average > 0) &&
      id &&
      (renderKind === "movie" || renderKind === "tvshow")
      ? `${config.base_render_api}/${renderKind}/${id}?ratings_filters=all`
      : null,
  );
  const item = fetched?.ratings_average > 0 ? fetched : props;

  const allocine_url = item?.allocine?.url;
  const allocine_users_rating = item?.allocine?.users_rating;
  const allocine_users_rating_count = item?.allocine?.users_rating_count;
  const allocine_critics_rating = item?.allocine?.critics_rating;
  const allocine_critics_rating_count = item?.allocine?.critics_rating_count;

  const betaseries_url = item?.betaseries?.url;
  const betaseries_users_rating = item?.betaseries?.users_rating;
  const betaseries_users_rating_count = item?.betaseries?.users_rating_count;

  const imdb_url = item?.imdb?.url;
  const imdb_users_rating = item?.imdb?.users_rating;
  const imdb_users_rating_count = item?.imdb?.users_rating_count;

  const letterboxd_url = item?.letterboxd?.url;
  const letterboxd_users_rating = item?.letterboxd?.users_rating;
  const letterboxd_users_rating_count = item?.letterboxd?.users_rating_count;

  const mojo_rank = item?.mojo?.rank;
  const mojo_url = item?.mojo?.url;

  const metacritic_url = item?.metacritic?.url;
  const metacritic_users_rating = item?.metacritic?.users_rating;
  const metacritic_users_rating_count = item?.metacritic?.users_rating_count;
  const metacritic_critics_rating = item?.metacritic?.critics_rating;
  const metacritic_critics_rating_count =
    item?.metacritic?.critics_rating_count;

  const rottentomatoes_url = item?.rotten_tomatoes?.url;
  const rottentomatoes_users_rating = item?.rotten_tomatoes?.users_rating;
  const rottentomatoes_users_rating_count =
    item?.rotten_tomatoes?.users_rating_count;
  const rottentomatoes_critics_rating = item?.rotten_tomatoes?.critics_rating;
  const rottentomatoes_critics_rating_count =
    item?.rotten_tomatoes?.critics_rating_count;

  const senscritique_url = item?.senscritique?.url;
  const senscritique_users_rating = item?.senscritique?.users_rating;
  const senscritique_users_rating_count =
    item?.senscritique?.users_rating_count;

  const tmdbKind = getKindByURL(kindURL);
  const tmdb_url =
    item?.tmdb?.url ??
    (id && tmdbKind !== "multi"
      ? `https://www.themoviedb.org/${tmdbKind}/${id}`
      : undefined);
  const tmdb_users_rating = item?.tmdb?.users_rating ?? item?.vote_average;
  const tmdb_users_rating_count =
    item?.tmdb?.users_rating_count ?? item?.vote_count;

  const trakt_url = item?.trakt?.url;
  const trakt_users_rating = item?.trakt?.users_rating;
  const trakt_users_rating_count = item?.trakt?.users_rating_count;

  // vote_average is on a /10 scale, ratings_average on a /5 scale.
  const ratings_average =
    item?.ratings_average > 0
      ? item.ratings_average
      : item?.vote_average > 0
        ? item.vote_average / 2
        : 0;

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
    mojo_rank,
    mojo_url,
  );

  const op = useRef(null);
  const isMounted = useRef(false);

  const displayRatingsDetails = (e) => {
    trackAnalyticsEvent("ratings_details_displayed", {
      allocine_id: allocineID,
    });

    if (isMounted.current && detailsData) {
      op.current.hide(e);
      isMounted.current = false;
    } else {
      op.current.show(e);
      isMounted.current = true;
    }
  };

  if (!(ratings_average > 0)) return null;

  return (
    <InfoRatings className="rating_details" onClick={displayRatingsDetails}>
      <span style={{ color: colors.green }}>★</span>{" "}
      {ratings_average.toFixed(1)}
      <OverlayPanel ref={op}>
        <DataTable value={detailsData} size="small">
          <Column body={logoBody} />
          <Column header="Name" body={nameBody} style={{ minWidth: "11rem" }} />
          <Column field="rating" header="Rating" body={ratingBody} />
        </DataTable>
        {mojoDetailsData.length > 0 && (
          <DataTable value={mojoDetailsData} size="small">
            <Column body={logoBody} />
            <Column header="-" body={nameBody} style={{ minWidth: "11rem" }} />
            <Column field="rank" header="Rank" body={rankBody} />
          </DataTable>
        )}
      </OverlayPanel>
    </InfoRatings>
  );
};

export default RatingBadge;
