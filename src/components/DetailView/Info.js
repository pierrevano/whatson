import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Row, Cell } from "griding";
import Section from "./Section";
import Relation from "./Relation";
import Toggle from "./Toggle";
import Text from "components/Text";
import * as theme from "../../theme";

const SeparatedText = styled(Text)`
  span + span {
    &:before {
      content: " • ";
    }
  }
`;

/**
 * A functional component that displays information about a movie or person.
 * @param {string} kind - The type of information being displayed (movie or person).
 * @param {Object} data - An object containing the data to be displayed.
 * @returns A JSX element that displays the information.
 */
const Info = ({
  kind,
  tagline_from_render,
  next_episode_from_render,
  last_episode_from_render,
  highest_episode_from_render,
  lowest_episode_from_render,
  ...data
}) => {
  const [sliceActors, setSliceActors] = useState(4);
  const [sliceDirectors, setSliceDirectors] = useState(4);

  const description = data?.overview || data?.biography;
  const genres = data?.genres?.map((x) => x.name) || [];
  const actors = data?.credits?.cast?.slice(0, sliceActors) || [];
  const totalActors = data?.credits?.cast?.length || 0;
  const directors =
    data?.credits?.crew
      ?.filter((x) => x.department === "Directing")
      .slice(0, sliceDirectors) || [];
  const totalDirectors =
    data?.credits?.crew?.filter((x) => x.department === "Directing")?.length ||
    0;

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num;
  };

  return (
    <Fragment>
      {tagline_from_render && (
        <Section title="Tagline">
          <span style={{ fontStyle: "italic" }}>{tagline_from_render}</span>
        </Section>
      )}
      {next_episode_from_render && (
        <Section title="Next episode">
          <SeparatedText sm={1} color={(p) => p.theme.colors.white || ""}>
            <span>
              S{next_episode_from_render.season}E
              {next_episode_from_render.episode}
            </span>
            <span>
              <a
                href={next_episode_from_render.url}
                target={"_blank"}
                className="imdb-link"
                rel="noopener noreferrer"
              >
                {next_episode_from_render.title}
              </a>
            </span>
            <span>
              {
                new Date(next_episode_from_render.release_date)
                  .toISOString()
                  .split("T")[0]
              }
            </span>
          </SeparatedText>
          {next_episode_from_render?.description && (
            <Text style={{ marginTop: "10px" }}>
              <span>{next_episode_from_render.description}</span>
            </Text>
          )}
        </Section>
      )}
      {last_episode_from_render && (
        <Section title="Last episode">
          <SeparatedText sm={1} color={(p) => p.theme.colors.white || ""}>
            <span>
              S{last_episode_from_render.season}E
              {last_episode_from_render.episode}
            </span>
            <span>
              <a
                href={last_episode_from_render.url}
                target={"_blank"}
                className="imdb-link"
                rel="noopener noreferrer"
              >
                {last_episode_from_render.title}
              </a>
            </span>
            {last_episode_from_render?.episode_type && (
              <span>{last_episode_from_render.episode_type}</span>
            )}
            {last_episode_from_render?.users_rating && (
              <span>
                {last_episode_from_render.users_rating}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  /10
                </span>{" "}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  ({formatNumber(last_episode_from_render?.users_rating_count)})
                </span>
              </span>
            )}
          </SeparatedText>
          {last_episode_from_render?.description && (
            <Text style={{ marginTop: "10px" }}>
              <span>{last_episode_from_render.description}</span>
            </Text>
          )}
        </Section>
      )}
      {highest_episode_from_render && (
        <Section title="Highest rated episode">
          <SeparatedText sm={1} color={(p) => p.theme.colors.white || ""}>
            <span>
              S{highest_episode_from_render.season}E
              {highest_episode_from_render.episode}
            </span>
            <span>
              <a
                href={highest_episode_from_render.url}
                target={"_blank"}
                className="imdb-link"
                rel="noopener noreferrer"
              >
                {highest_episode_from_render.title}
              </a>
            </span>
            {highest_episode_from_render?.episode_type && (
              <span>{highest_episode_from_render.episode_type}</span>
            )}
            {highest_episode_from_render?.users_rating && (
              <span>
                {highest_episode_from_render.users_rating}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  /10
                </span>{" "}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  (
                  {formatNumber(
                    highest_episode_from_render?.users_rating_count,
                  )}
                  )
                </span>
              </span>
            )}
          </SeparatedText>
          {highest_episode_from_render?.description && (
            <Text style={{ marginTop: "10px" }}>
              <span>{highest_episode_from_render.description}</span>
            </Text>
          )}
        </Section>
      )}
      {lowest_episode_from_render && (
        <Section title="Lowest rated episode">
          <SeparatedText sm={1} color={(p) => p.theme.colors.white || ""}>
            <span>
              S{lowest_episode_from_render.season}E
              {lowest_episode_from_render.episode}
            </span>
            <span>
              <a
                href={lowest_episode_from_render.url}
                target={"_blank"}
                className="imdb-link"
                rel="noopener noreferrer"
              >
                {lowest_episode_from_render.title}
              </a>
            </span>
            {lowest_episode_from_render?.episode_type && (
              <span>{lowest_episode_from_render.episode_type}</span>
            )}
            {lowest_episode_from_render?.users_rating && (
              <span>
                {lowest_episode_from_render.users_rating}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  /10
                </span>{" "}
                <span style={{ color: `${theme.colors.lightGrey}` }}>
                  (
                  {formatNumber(lowest_episode_from_render?.users_rating_count)}
                  )
                </span>
              </span>
            )}
          </SeparatedText>
          {lowest_episode_from_render?.description && (
            <Text style={{ marginTop: "10px" }}>
              <span>{lowest_episode_from_render.description}</span>
            </Text>
          )}
        </Section>
      )}
      {description && <Section title="Plot">{description}</Section>}
      <Row style={{ justifyContent: "space-between" }}>
        {!!totalActors && (
          <Cell xs={12} md={6}>
            <Section title={kind === "person" ? "Acted on" : "Actors"}>
              {actors.map((actor) => (
                <Relation key={actor?.id} kind={kind} {...actor} />
              ))}
              {totalActors > 4 && (
                <Toggle
                  more={!!sliceActors}
                  onClick={() => setSliceActors(!!sliceActors ? undefined : 4)}
                />
              )}
            </Section>
          </Cell>
        )}
        <Cell xs={12} md={6}>
          {!!genres.length && (
            <Section title="Genres">
              {genres.map((genre) => (
                <div key={genre}>{genre}</div>
              ))}
            </Section>
          )}
          {!!totalDirectors && (
            <Section title={kind === "person" ? "Directed" : "Directors"}>
              {directors.map((director) => (
                <Relation key={director.id} kind={kind} {...director} />
              ))}
              {totalDirectors > 4 && (
                <Toggle
                  more={!!sliceDirectors}
                  onClick={() =>
                    setSliceDirectors(!!sliceDirectors ? undefined : 4)
                  }
                />
              )}
            </Section>
          )}
        </Cell>
      </Row>
    </Fragment>
  );
};

export default Info;
