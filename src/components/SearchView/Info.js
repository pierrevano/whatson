import React from "react";
import styled from "styled-components";
import InfoScreen from "components/InfoScreen";
import Link from "components/Link";
import { shouldSendCustomEvents } from "utils/shouldSendCustomEvents";

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
 * @param {string} kind - The type of search to perform (movies, people, or tvshows).
 * @param {Object} props - Additional props to pass to the InfoScreen component.
 * @returns An InfoScreen component with a title based on the given kind prop.
 */
const Info = ({ kind, ...props }) => {
  if (shouldSendCustomEvents()) {
    window.beam?.(`/custom-events/search_view_opened/${kind}`);
  }

  if (kind === "movies")
    return <InfoScreen title="Search for movies" {...props} />;
  if (kind === "people")
    return <InfoScreen title="Search for people" {...props} />;
  if (kind === "tvshows")
    return <InfoScreen title="Search for tvshows" {...props} />;

  return (
    <InfoScreen
      title={
        <span>
          Search for{" "}
          <Anchor to="/movies" ariaLabel="Search for movies">
            movies
          </Anchor>
          ,{" "}
          <Anchor to="/tvshows" ariaLabel="Search for tvshows">
            tvshows
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
