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
              {next_episode_from_render.season}x
              {next_episode_from_render.episode}
            </span>
            <span>{next_episode_from_render.title}</span>
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
              {last_episode_from_render.season}x
              {last_episode_from_render.episode}
            </span>
            <span>{last_episode_from_render.title}</span>
            {last_episode_from_render?.users_rating && (
              <span>
                {last_episode_from_render.users_rating}
                <span style={{ color: `${theme.colors.lightGrey}` }}>/10</span>
              </span>
            )}
          </SeparatedText>
          {next_episode_from_render?.description && (
            <Text style={{ marginTop: "10px" }}>
              <span>{last_episode_from_render.description}</span>
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
