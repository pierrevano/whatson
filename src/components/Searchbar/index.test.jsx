import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "styled-components";
import Searchbar from "./index";
import * as theme from "../../theme";

jest.mock("components/Container", () => ({ children }) => (
  <div>{children}</div>
));

const renderSearchbar = (kindURL) =>
  render(
    <ThemeProvider theme={theme}>
      <Searchbar kindURL={kindURL} value="" onChange={jest.fn()} />
    </ThemeProvider>,
  );

describe("Searchbar placeholder", () => {
  it("shows 'movies' for movies kindURL", () => {
    renderSearchbar("movies");
    expect(
      screen.getByPlaceholderText("Search for movies..."),
    ).toBeInTheDocument();
  });

  it("shows 'people' for people kindURL", () => {
    renderSearchbar("people");
    expect(
      screen.getByPlaceholderText("Search for people..."),
    ).toBeInTheDocument();
  });

  it("shows 'tvshows' for tvshows kindURL", () => {
    renderSearchbar("tvshows");
    expect(
      screen.getByPlaceholderText("Search for tvshows..."),
    ).toBeInTheDocument();
  });

  it("shows IMDb ID hint for search kindURL", () => {
    renderSearchbar("search");
    expect(
      screen.getByPlaceholderText(
        "Search for movies, tvshows, people or an IMDb ID...",
      ),
    ).toBeInTheDocument();
  });
});
