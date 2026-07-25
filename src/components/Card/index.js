import { Heart, Movie, Person, TVShow } from "components/Icon";
import { memo } from "react";
import { saveDetailReturnScroll } from "utils/detailNavigationScroll";
import { useFavoriteState } from "utils/favorites";
import AspectRatio from "components/AspectRatio";
import Link from "components/Link";
import RatingBadge from "components/RatingBadge";
import styled, { css } from "styled-components";
import Text from "components/Text";

const Wrapper = styled.div`
  background: none;
  border: none;
  margin: 0;
  flex: 1;
  display: flex;
  position: relative;
  background: ${(p) =>
    p.$error
      ? p.theme.colors.red
      : p.$loading
        ? p.theme.colors.midGrey
        : p.theme.colors.grey};
  border-radius: 0.1875rem;
  cursor: pointer;

  ${(p) =>
    p.$loading &&
    css`
      overflow: hidden;

      &::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.08) 50%,
          transparent 100%
        );
        transform: translateX(-100%);
        animation: shimmer 1.6s infinite;
      }
    `}

  @keyframes shimmer {
    to {
      transform: translateX(100%);
    }
  }
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
 * Renders a media card with artwork, ratings, and optional actions for movies,
 * TV shows, or people.
 * @param {Object} props - Source data describing the card contents.
 * @param {string} props.id - Identifier for the rendered entity.
 * @param {boolean} [props.loading=false] - When true the card displays a skeleton state.
 * @param {boolean} [props.error=false] - When true the card shows an error placeholder.
 * @param {boolean} [props.loadMore=false] - Whether the card should render the “Load more” affordance.
 * @param {string} [props.media_type] - API media type used to infer routing.
 * @returns {JSX.Element} Media card layout.
 */
const Card = ({ id, loading, error, loadMore, ...props }) => {
  const kind = props?.media_type;
  const kindURL = getKindURL(props?.media_type) || props.kindURL;

  const title = props?.title || props?.name;

  let image = props?.poster_path || props?.profile_path || props?.image;
  if (image && image.startsWith("/")) {
    image = `https://image.tmdb.org/t/p/w300${image}`;
  }

  return (
    <Wrapper $error={error} $loading={loading} {...props}>
      <AspectRatio ratio={0.75} />
      {!(loading || error || loadMore) && (
        <Anchor
          to={`/${kindURL}/${id}`}
          tabIndex={0}
          ariaLabel={`poster for: ${title}`}
          onClick={saveDetailReturnScroll}
        />
      )}
      <OverflowHidden>
        {image && (
          <Image src={image} alt={`poster for: ${title}`} loading="lazy" />
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
            <RatingBadge {...props} id={id} kindURL={kindURL} />
          </OverlayRatings>
        )}
      </AbsoluteFill>
    </Wrapper>
  );
};

export default memo(Card);
