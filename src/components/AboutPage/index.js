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
              This app purpose is to help you get quickly highest rated movies/tv shows or explore the information provided by{" "}
              <Anchor to="https://www.themoviedb.org" ariaLabel="The Movie Database (TMDB)">
                The Movie Database (TMDB)
              </Anchor>
              .
            </Text>
            <Text style={{ margin: "1em 0" }}>
              I have added 2 main new features: filters and cinemas search, but most of the codebase comes from this{" "}
              <Anchor to="https://github.com/vitordino/movies" ariaLabel="Vitordino GitHub repository">
                repository
              </Anchor>{" "}
              and all the design credits should be addressed to{" "}
              <Anchor to="https://vitordino.com" ariaLabel="Vitordino website">
                Vitor Dino
              </Anchor>
              .
            </Text>
            <Text style={{ margin: "1em 0" }}>
              The raw data comes from AlloCiné, BetaSeries, IMDb, Metacritic, Rotten Tomatoes and The Movie Database, all extracted with shell and Node.js scripts and pushed to a MongoDB. Then on the client side it's built with React.js and fetched from an Express.js API. Feel free to visit my{" "}
              <Anchor to="https://github.com/pierrevano" ariaLabel="My personal GitHub repository">
                GitHub
              </Anchor>{" "}
              for more details.
            </Text>
          </Cell>
        </Row>
      </Container>
    </Wrapper>
  );
};

export default AboutPage;
