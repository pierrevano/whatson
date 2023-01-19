import React from "react";
import styled from "styled-components";
import LazyImage from "react-lazy-progressive-image";
import { useFavoriteState } from "utils/favorites";
import Link from "components/Link";
import AspectRatio from "components/AspectRatio";
import Text from "components/Text";
import { Heart, Movie, Person, TV } from "components/Icon";

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

const Card = ({ id, loading, error, loadMore, ...props }) => {
  const kind = props?.media_type;
  const kindURL = getKindURL(props?.media_type) || props.kindURL;
  const ratings_average = props?.ratings_average;
  let image = props?.poster_path || props?.profile_path || props?.image;
  if (image && image.startsWith("/")) image = `https://image.tmdb.org/t/p/w300/${image}`;

  return (
    <Wrapper error={error} {...props}>
      <AspectRatio ratio={0.75} />
      {!(loading || error || loadMore) && <Anchor to={`/${kindURL}/${id}`} tabIndex={0} />}
      <OverflowHidden>
        {image && (
          <LazyImage placeholder={`${image}`} src={`${image}`}>
            {(src, loading) => <Image src={src} loading={+loading} />}
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
              <Info>
                <span style={{ color: "#28A745" }}>★</span> {ratings_average.toFixed(1)}
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
