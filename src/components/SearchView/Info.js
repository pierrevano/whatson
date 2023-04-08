import React from "react";
import styled from "styled-components";
import InfoScreen from "components/InfoScreen";
import Link from "components/Link";

const Anchor = styled(Link)`
  border-radius: 0.125rem;
  color: currentColor;
  outline: none;
  &:focus,
  &:hover {
    color: ${(p) => p.theme.colors.green};
    text-decoration: none;
  }
`;

/**
 * Renders an InfoScreen component with a title based on the given kind prop.
 * @param {string} kind - The type of search to perform (movies, people, or tv).
 * @param {Object} props - Additional props to pass to the InfoScreen component.
 * @returns An InfoScreen component with a title based on the given kind prop.
 */
const Info = ({ kind, ...props }) => {
  if (kind === "movies") return <InfoScreen title="Search for movies" {...props} />;
  if (kind === "people") return <InfoScreen title="Search for people" {...props} />;
  if (kind === "tv") return <InfoScreen title="Search for tv shows" {...props} />;
  return (
    <InfoScreen
      title={
        <span>
          Search for{" "}
          <Anchor to="/movies" ariaLabel="Search for movies">
            movies
          </Anchor>
          ,{" "}
          <Anchor to="/tv" ariaLabel="Search for tv shows">
            tv shows
          </Anchor>{" "}
          or{" "}
          <Anchor to="/people" ariaLabel="Search for people">
            people
          </Anchor>
        </span>
      }
      {...props}
    />
  );
};

export default Info;
