import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CardsByPage from "./CardsByPage";
import config from "../../config";
import tmdbSearchResponse from "./__fixtures__/tmdbSearchResponse.json";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";
import whatsonApiImdbResponse from "./__fixtures__/whatsonApiImdbResponse.json";

jest.mock("../../config", () => ({
  __esModule: true,
  default: {
    ...jest.requireActual("../../config").default,
    api: "test-tmdb-key",
  },
}));

jest.mock("query-string", () => ({
  __esModule: true,
  default: {
    parse: jest.fn(() => ({})),
  },
}));

jest.mock("griding", () => ({
  Cell: ({ children }) => <div>{children}</div>,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => [jest.fn(), false],
}));

jest.mock("components/Card", () => () => <div>Card</div>);

jest.mock("components/InfoScreen", () => ({ title, description }) => (
  <div>
    <div>{title}</div>
    <div>{description}</div>
  </div>
));

jest.mock("utils/useStorageString", () => ({
  useStorageString: (_key, initialValue = "") => [initialValue, jest.fn()],
}));

jest.mock("utils/useFetchWithStatusCode", () => jest.fn());

describe("CardsByPage", () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    Math.random = jest.fn(() => 0);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("calls the What's on? API when search is an IMDb ID and renders one result", () => {
    useFetchWithStatusCode.mockReturnValue({
      data: whatsonApiImdbResponse,
      error: null,
      isLoading: false,
    });

    render(
      <CardsByPage
        search="tt0903747"
        page={1}
        setPage={jest.fn()}
        isLastPage={true}
        kindURL="search"
      />,
    );

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(
      `${config.base_render_api}/?imdbId=tt0903747`,
    );
    expect(screen.getAllByText("Card")).toHaveLength(1);
  });

  it("calls the TMDB API for a regular search term and renders multiple results", () => {
    useFetchWithStatusCode.mockReturnValue({
      data: tmdbSearchResponse,
      error: null,
      isLoading: false,
    });

    render(
      <CardsByPage
        search="breaking bad"
        page={1}
        setPage={jest.fn()}
        isLastPage={true}
        kindURL="search"
      />,
    );

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(
      expect.stringContaining("api.themoviedb.org"),
    );
    expect(screen.getAllByText("Card")).toHaveLength(3);
  });

  it("shows the error message on the first page when filters return 404 without a search term", () => {
    useFetchWithStatusCode.mockReturnValue({
      data: null,
      error: new Error("Network response was not ok"),
      isLoading: false,
    });

    render(
      <CardsByPage
        search=""
        page={1}
        setPage={jest.fn()}
        isLastPage={true}
        kindURL="multi"
      />,
    );

    expect(screen.getByText("I’m sorry Dave.")).toBeInTheDocument();
    expect(screen.getByText("I’m afraid I can’t do that.")).toBeInTheDocument();
  });
});
