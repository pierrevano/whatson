import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import * as theme from "../../theme";
import Card from "components/Card";
import config from "../../config";
import RatingBadge from "./index";

jest.mock("utils/analytics", () => ({
  trackAnalyticsEvent: jest.fn(),
}));

jest.mock("utils/useFetchWithStatusCode", () => jest.fn());

jest.mock("utils/favorites", () => ({
  useFavoriteState: () => [false, { toggle: jest.fn() }],
}));

jest.mock("primereact/overlaypanel", () => {
  const React = require("react");
  return {
    OverlayPanel: React.forwardRef(({ children }, ref) => {
      const [visible, setVisible] = React.useState(false);
      React.useImperativeHandle(ref, () => ({
        show: () => setVisible(true),
        hide: () => setVisible(false),
      }));
      return visible ? <div>{children}</div> : null;
    }),
  };
});

jest.mock("primereact/column", () => ({
  Column: () => null,
}));

jest.mock("primereact/datatable", () => {
  const React = require("react");
  return {
    DataTable: ({ value = [], children }) => {
      const columns = React.Children.toArray(children)
        .filter(Boolean)
        .map((child) => child.props);

      return (
        <table>
          <tbody>
            {value.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => {
                  const cellValue =
                    typeof column.body === "function"
                      ? column.body(row)
                      : column.field
                        ? row[column.field]
                        : null;
                  return <td key={colIndex}>{cellValue}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      );
    },
  };
});

const { trackAnalyticsEvent } = require("utils/analytics");
const useFetchWithStatusCode = require("utils/useFetchWithStatusCode");

beforeEach(() => {
  jest.clearAllMocks();
  useFetchWithStatusCode.mockReturnValue({
    data: null,
    error: null,
    isLoading: false,
  });
});

describe("RatingBadge", () => {
  it("renders the average rating from the What's On API data", () => {
    render(<RatingBadge id="123" kindURL="movies" ratings_average={4.2} />);

    expect(screen.getByText("4.2")).toBeInTheDocument();
    expect(screen.getByText("★")).toBeInTheDocument();
  });

  it("renders nothing without any rating", () => {
    const { container } = render(<RatingBadge id="123" kindURL="movies" />);

    expect(container).toBeEmptyDOMElement();
  });

  it("falls back to the TMDB vote_average converted to a /5 scale", () => {
    render(
      <RatingBadge
        id="123"
        kindURL="movies"
        vote_average={8.4}
        vote_count={1200}
      />,
    );

    expect(screen.getByText("4.2")).toBeInTheDocument();
  });

  it("prefers the What's On average over the TMDB one", () => {
    render(
      <RatingBadge
        id="123"
        kindURL="movies"
        ratings_average={3.9}
        vote_average={8.4}
      />,
    );

    expect(screen.getByText("3.9")).toBeInTheDocument();
  });

  it("opens a details panel with a TMDB row built from raw TMDB data", () => {
    render(
      <RatingBadge
        id="123"
        kindURL="tvshows"
        vote_average={8.4}
        vote_count={1200}
      />,
    );

    fireEvent.click(screen.getByText("4.2"));

    const link = screen.getByRole("link", { name: "TMDB users" });
    expect(link).toHaveAttribute("href", "https://www.themoviedb.org/tv/123");
    expect(screen.getByText("/10")).toBeInTheDocument();
    expect(screen.getByText("(1.2K)")).toBeInTheDocument();
    expect(trackAnalyticsEvent).toHaveBeenCalledWith(
      "ratings_details_displayed",
      expect.any(Object),
    );
  });

  it("fetches the full per-source ratings for a TMDB-only item", () => {
    useFetchWithStatusCode.mockImplementation((url) => ({
      data:
        url === `${config.base_render_api}/movie/123?ratings_filters=all`
          ? {
              ratings_average: 4.3,
              allocine: {
                url: "https://www.allocine.fr/film/fichefilm_gen_cfilm=315.html",
                users_rating: 4.4,
                users_rating_count: 1000,
              },
              imdb: {
                url: "https://www.imdb.com/title/tt0903747/",
                users_rating: 9.5,
                users_rating_count: 2000000,
              },
            }
          : null,
      error: null,
      isLoading: false,
    }));

    render(<RatingBadge id="123" kindURL="movies" vote_average={8.4} />);

    fireEvent.click(screen.getByText("4.3"));

    expect(
      screen.getByRole("link", { name: "AlloCiné users" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IMDb users" })).toHaveAttribute(
      "href",
      "https://www.imdb.com/title/tt0903747/",
    );
  });

  it("does not fetch when the average rating is already provided", () => {
    render(<RatingBadge id="123" kindURL="movies" ratings_average={4.2} />);

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(null);
  });

  it("does not fetch for people", () => {
    render(<RatingBadge id="123" kindURL="people" />);

    expect(useFetchWithStatusCode).toHaveBeenCalledWith(null);
  });

  it("lists the per-source ratings from the What's On API data", () => {
    render(
      <RatingBadge
        id="123"
        kindURL="movies"
        ratings_average={4.2}
        imdb={{
          url: "https://www.imdb.com/title/tt0903747/",
          users_rating: 9.5,
          users_rating_count: 2000000,
        }}
        tmdb={{
          url: "https://www.themoviedb.org/movie/456",
          users_rating: 8.9,
          users_rating_count: 15000,
        }}
      />,
    );

    fireEvent.click(screen.getByText("4.2"));

    expect(screen.getByRole("link", { name: "IMDb users" })).toHaveAttribute(
      "href",
      "https://www.imdb.com/title/tt0903747/",
    );
    expect(screen.getByRole("link", { name: "TMDB users" })).toHaveAttribute(
      "href",
      "https://www.themoviedb.org/movie/456",
    );
  });
});

describe("Card", () => {
  const renderCard = (props) =>
    render(
      <ThemeProvider theme={theme}>
        <MemoryRouter
          future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
        >
          <Card {...props} />
        </MemoryRouter>
      </ThemeProvider>,
    );

  it("shows the rating badge for a What's On API item", () => {
    renderCard({
      id: "123",
      kindURL: "movies",
      title: "The Odyssey",
      ratings_average: 4.2,
    });

    expect(screen.getByText("The Odyssey")).toBeInTheDocument();
    expect(screen.getByText("4.2")).toBeInTheDocument();
  });

  it("shows the rating badge for a TMDB search result", () => {
    renderCard({
      id: "123",
      media_type: "movie",
      title: "The Odyssey",
      vote_average: 8.4,
      vote_count: 1200,
    });

    fireEvent.click(screen.getByText("4.2"));

    expect(screen.getByRole("link", { name: "TMDB users" })).toHaveAttribute(
      "href",
      "https://www.themoviedb.org/movie/123",
    );
  });

  it("shows the rating badge for a TMDB favorite item", () => {
    renderCard({
      id: "123",
      kindURL: "tvshows",
      name: "Breaking Bad",
      vote_average: 8.9,
      vote_count: 15000,
    });

    fireEvent.click(screen.getByText("4.5"));

    expect(screen.getByRole("link", { name: "TMDB users" })).toHaveAttribute(
      "href",
      "https://www.themoviedb.org/tv/123",
    );
  });

  it("shows no rating badge for an item without ratings", () => {
    renderCard({
      id: "123",
      kindURL: "people",
      name: "Bryan Cranston",
    });

    expect(screen.getByText("Bryan Cranston")).toBeInTheDocument();
    expect(screen.queryByText("★")).not.toBeInTheDocument();
  });
});
