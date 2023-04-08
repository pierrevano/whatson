import React from "react";
import styled from "styled-components";
import Link from "components/Link";

const Wrapper = styled(Link)`
  color: currentColor;
  text-decoration: none;
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 1rem;
  &:focus {
    ${(p) => p.theme.focusShadow}
  }
  & + & {
    margin-top: 0.5rem;
  }
`;

const Avatar = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  overflow: hidden;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  background: ${(p) => p.theme.colors.grey};
  color: ${(p) => p.theme.colors.lightGrey};
  font-size: 0.625rem;
  line-height: 0.625rem;
  font-weight: 500;
  user-select: none;
  pointer-events: none;
  flex-shrink: 0;
  img {
    width: 100%;
  }
`;

const Main = styled.div`
  margin-right: 0.5rem;
`;

const getURL = (kind, id) => {
  if (kind === "person") return `/movies/${id}`;
  return `/people/${id}`;
};

/**
 * A component that displays information about a movie or TV show relation.
 * @param {string} id - The ID of the relation.
 * @param {string} kind - The type of relation (movie or tv).
 * @param {string} name - The name of the person associated with the relation.
 * @param {string} poster_path - The path to the poster image for the relation.
 * @param {string} profile_path - The path to the profile image for the person associated with the relation.
 * @param {string} character - The character name for the person associated with the relation.
 * @param {string} title - The title of the movie or TV show associated with the relation.
 * @param {
 */
const Relation = ({ id, kind, name, poster_path, profile_path, character, title, ...props }) => {
  const url = getURL(kind, id);
  const image = profile_path || poster_path;
  const main = name || title || character;
  return (
    <Wrapper to={url} {...props}>
      <Avatar>{image ? <img alt={main} src={`https://image.tmdb.org/t/p/w45${image}`} /> : <div>{(main || " ")[0]}</div>}</Avatar>
      <Main>{main}</Main>
    </Wrapper>
  );
};

export default Relation;
