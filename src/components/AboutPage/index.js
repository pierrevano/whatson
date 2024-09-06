import React, { useEffect } from "react";
import styled from "styled-components";
import { Row, Cell } from "griding";
import Container from "components/Container";
import Text from "components/Text";
import Link from "components/Link";

const Wrapper = styled.div`
	flex: 1
	display: flex;
	flex-direction: column;
	transition: 0.2s all;
`;

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
 * A functional component that renders the About page of the app.
 * @returns JSX element that displays information about the app.
 */
const AboutPage = () => {
  useEffect(() => {
    document.title = "About";
  });

  return (
    <Wrapper>
      <Container>
        <Text weight={600} xs={2} sm={3} md={4} xg={5}>
          About
        </Text>
        <Row vertical-gutter>
          <Cell xs={12} md={7} lg={6}>
            <Text xs={0} sm={1} style={{ margin: "1em 0" }}>
              The purpose of this app is to help you quickly find the
              highest-rated movies and TV shows or explore the information
              provided by{" "}
              <Anchor
                to="https://www.themoviedb.org"
                ariaLabel="The Movie Database (TMDB)"
              >
                The Movie Database (TMDB)
              </Anchor>
              .
            </Text>
            <Text style={{ margin: "1em 0" }}>
              All displayed data is fetched from the What's on? API, and I have
              implemented additional filters. Most of the codebase is derived
              from{" "}
              <Anchor to="https://vitordino.com" ariaLabel="Vitor Dino website">
                Vitor Dino
              </Anchor>{" "}
              <Anchor
                to="https://github.com/vitordino/movies"
                ariaLabel="Vitor Dino GitHub original repository"
              >
                repository
              </Anchor>
              , to whom all design credits are due.
            </Text>
            <Text style={{ margin: "1em 0" }}>
              The raw data is sourced from multiple platforms, including
              AlloCiné, BetaSeries, IMDb, Letterboxd, Metacritic, Rotten
              Tomatoes, SensCritique, Trakt, and The Movie Database (TMDB). This
              data is extracted using shell and Node.js scripts and stored in a
              MongoDB database. On the client side, the application is built
              with React.js and accesses data through an Express.js API. For
              more details, feel free to visit my{" "}
              <Anchor
                to="https://github.com/pierrevano"
                ariaLabel="My GitHub profile"
              >
                GitHub profile
              </Anchor>
              .
            </Text>
            <Text style={{ margin: "1em 0" }}>
              Additionally, this app is ad-free and does not use cookies. It
              only employs a GDPR-compliant solution,{" "}
              <Anchor to="https://beamanalytics.io" ariaLabel="Beam Analytics">
                Beam Analytics
              </Anchor>
              , to enhance the user experience.
            </Text>
          </Cell>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default AboutPage;
