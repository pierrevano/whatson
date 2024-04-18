import React, { Fragment, useState } from "react";
import { Row, Cell } from "griding";
import Section from "./Section";
import Relation from "./Relation";
import Toggle from "./Toggle";

/**
 * A functional component that displays information about a movie or person.
 * @param {string} kind - The type of information being displayed (movie or person).
 * @param {Object} data - An object containing the data to be displayed.
 * @returns A JSX element that displays the information.
 */
const Info = ({ kind, tagline, ...data }) => {
  const [sliceActors, setSliceActors] = useState(4);
  const [sliceDirectors, setSliceDirectors] = useState(4);

  const description = data?.overview || data?.biography;
  const genres = data?.genres?.map((x) => x.name) || [];
  const actors = data?.credits?.cast?.slice(0, sliceActors) || [];
  const totalActors = data?.credits?.cast?.length || 0;
  const directors = data?.credits?.crew?.filter((x) => x.department === "Directing").slice(0, sliceDirectors) || [];
  const totalDirectors = data?.credits?.crew?.filter((x) => x.department === "Directing")?.length || 0;

  return (
    <Fragment>
      {tagline && (
        <Section title="Tagline">
          <span style={{ fontStyle: "italic" }}>{tagline}</span>
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
              {totalActors > 4 && <Toggle more={!!sliceActors} onClick={() => setSliceActors(!!sliceActors ? undefined : 4)} />}
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
              {totalDirectors > 4 && <Toggle more={!!sliceDirectors} onClick={() => setSliceDirectors(!!sliceDirectors ? undefined : 4)} />}
            </Section>
          )}
        </Cell>
      </Row>
    </Fragment>
  );
};

export default Info;
