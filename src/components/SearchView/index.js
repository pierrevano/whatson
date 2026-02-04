import React, { useEffect } from "react";
import styled from "styled-components";
import { Row } from "griding";
import { useStorageString } from "utils/useStorageString";
import { getTitleFromURL } from "utils/kind";
import Search from "components/Searchbar";
import Container from "components/Container";
import CardsByPage from "./CardsByPage";
import Info from "./Info";

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

/**
 * Lists catalog results for the requested kind while keeping pagination state in
 * localStorage so subsequent visits resume the same page.
 * @param {boolean} [isSearchable=true] - Whether the search input should be displayed.
 * @param {string} [kindURL="multi"] - Content category such as `movies`, `people`, `search`, or `tvshows`.
 * @returns {JSX.Element} Search scaffold with results grid and optional helper text.
 */
const SearchView = ({ isSearchable = true, kindURL = "multi" }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }, 100);
    }
  }, []);

  useEffect(() => {
    document.title = getTitleFromURL(kindURL);
  }, [kindURL]);

  const [search, setSearch] = useStorageString("search", "");
  const [pageString, setPage] = useStorageString("page", "1");
  const page = +pageString;
  const pagesArray = [
    ...Array(page)
      .fill(0)
      .map((_x, i) => i + 1),
  ];

  useEffect(() => {
    if (!isSearchable || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const queryParam = params.get("q");
    if (queryParam !== null) {
      setSearch(queryParam);
      setPage(1);
    }
  }, [isSearchable, setSearch, setPage]);

  useEffect(() => {
    if (!isSearchable || typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (search) {
      url.searchParams.set("q", search);
    } else {
      url.searchParams.delete("q");
    }
    window.history.replaceState({}, "", url.toString());
  }, [isSearchable, search]);

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
        <Row
          vertical-gutter
          style={{
            marginTop: ["movies", "people", "search", "tvshows"].includes(
              kindURL,
            )
              ? "2rem"
              : undefined,
            marginBottom: "1rem",
            position: "relative",
            zIndex: ["movies", "people", "search", "tvshows"].includes(kindURL)
              ? 2
              : undefined,
          }}
        >
          {pagesArray.map((page) => (
            <CardsByPage
              key={page}
              search={search}
              page={page}
              setPage={setPage}
              isLastPage={pagesArray.slice(-1)[0] === page}
              kindURL={kindURL}
            />
          ))}
        </Row>
      </Container>
      {!search &&
        ["movies", "people", "search", "tvshows"].includes(kindURL) && (
          <Info
            emoji="☝️"
            kind={kindURL}
            description="use the search bar above"
          />
        )}
    </Wrapper>
  );
};

export default SearchView;
