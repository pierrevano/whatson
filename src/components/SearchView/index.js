import React, { useEffect } from "react";
import styled from "styled-components";
import { Row } from "griding";
import { useStorageString } from "utils/useStorageString";
import { getTitleFromURL } from "utils/kind";
import Search from "components/Searchbar";
import Container from "components/Container";
import CardsByPage from "./CardsByPage";
import Info from "./Info";
import useCacheBuster from "utils/useCacheBuster";
import useScript from "utils/useScript";
import config from "utils/config";
import consoleMessage from "utils/consoleMessage";

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  transition: 0.2s all;
`;

const Searchbar = styled(Search)`
  position: sticky;
  top: 0.875rem;
  z-index: 3;
`;

/* eslint-disable no-mixed-operators */
/**
 * A component that displays a search bar and a list of cards based on the search query and page number.
 * @param {boolean} [isSearchable=true] - Whether or not the component should display a search bar.
 * @param {string} [kindURL="multi"] - The type of content to display (e.g. movies, people, search, tvshow).
 * @returns A React component that displays a search bar and a list of cards based on the search query and page number.
 */
const SearchView = ({ isSearchable = true, kindURL = "multi" }) => {
  useCacheBuster();
  consoleMessage();

  useScript(config.base_beamanalytics, config.beamanalytics_token);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }, []);

  useEffect(
    () => {
      document.title = getTitleFromURL(kindURL);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const [search, setSearch] = useStorageString("search", "");

  const [pageString, setPage] = useStorageString("page", "1");
  const page = +pageString;
  const pagesArray = [
    ...Array(page)
      .fill(0)
      .map((_x, i) => i + 1),
  ];

  return (
    <Wrapper>
      {isSearchable && (
        <Searchbar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          kindURL={kindURL}
        />
      )}
      <Container>
        <Row vertical-gutter style={{ marginTop: (kindURL === "movies" || kindURL === "people" || kindURL === "search" || kindURL === "tvshows") && "2rem", marginBottom: "2rem", position: "relative", zIndex: (kindURL === "movies" || kindURL === "people" || kindURL === "search" || kindURL === "tvshows") && 2 }}>
          {pagesArray.map((page) => (
            <CardsByPage key={page} search={search} page={page} setPage={setPage} isLastPage={pagesArray.slice(-1)[0] === page} kindURL={kindURL} />
          ))}
        </Row>
      </Container>
      {!search && (kindURL === "movies" || kindURL === "people" || kindURL === "search" || kindURL === "tvshows") && <Info emoji="☝️" kind={kindURL} description="use the search bar above" />}
    </Wrapper>
  );
};
/* eslint-enable no-mixed-operators */

export default SearchView;
