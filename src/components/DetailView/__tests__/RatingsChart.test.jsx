import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RatingsChart from "../RatingsChart";

jest.mock("utils/analytics", () => ({
  trackAnalyticsEvent: jest.fn(),
}));

jest.mock("react-hooks-fetch", () => ({
  useFetch: jest.fn(),
}));

jest.mock("primereact/chart", () => {
  const React = require("react");
  return {
    Chart: React.forwardRef(({ type, data }, ref) => {
      React.useImperativeHandle(ref, () => ({
        getChart: () => ({
          resize: () => {},
          canvas: { width: 320, height: 180 },
        }),
      }));

      return React.createElement(
        "div",
        { "data-testid": `chart-${type}` },
        data?.labels?.join(",") || "",
      );
    }),
  };
});

jest.mock("primereact/tabview", () => {
  const React = require("react");
  return {
    TabView: ({ children }) => <div>{children}</div>,
    TabPanel: ({ header, children }) => (
      <section>
        <h2>{header}</h2>
        {children}
      </section>
    ),
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

const { useFetch } = require("react-hooks-fetch");

const buildResponse = () => ({
  last_episode: {
    season: 2,
    episode: 8,
    title: "Last Ep",
    users_rating: 8.5,
    release_date: "2026-02-26T00:00:00.000Z",
  },
  next_episode: {
    season: 2,
    episode: 9,
    title: "Next Ep",
    users_rating: null,
    release_date: "2026-03-06T00:00:00.000Z",
  },
  seasons: [
    {
      season_number: 1,
      episodes_count: 3,
      average_users_rating: 8.6,
      users_rating_count: 12000,
      highest_episode: {
        season: 1,
        episode: 2,
        title: "Ep2",
        users_rating: 9.9,
      },
      lowest_episode: {
        season: 1,
        episode: 1,
        title: "Ep1",
        users_rating: 7.5,
      },
      rating_distribution: { 8: 1, 9: 2 },
      rating_distribution_episodes: {
        8: [
          {
            season: 1,
            episode: 1,
            title: "Ep1",
            users_rating: 7.5,
          },
        ],
        9: [
          {
            season: 1,
            episode: 2,
            title: "Ep2",
            users_rating: 9.9,
          },
          {
            season: 1,
            episode: 3,
            title: "Ep3",
            users_rating: 8.6,
          },
        ],
      },
    },
    {
      season_number: 2,
      episodes_count: 2,
      average_users_rating: 8.2,
      users_rating_count: 9000,
      highest_episode: {
        season: 2,
        episode: 2,
        title: "Ep5",
        users_rating: 8.8,
      },
      lowest_episode: {
        season: 2,
        episode: 1,
        title: "Ep4",
        users_rating: 7.9,
      },
      rating_distribution: { 8: 2 },
      rating_distribution_episodes: {
        8: [
          {
            season: 2,
            episode: 1,
            title: "Ep4",
            users_rating: 7.9,
          },
          {
            season: 2,
            episode: 2,
            title: "Ep5",
            users_rating: 8.8,
          },
        ],
      },
    },
    {
      season_number: 3,
      episodes_count: 1,
      average_users_rating: null,
      users_rating_count: null,
      highest_episode: null,
      lowest_episode: null,
      rating_distribution: {},
      rating_distribution_episodes: {},
    },
  ],
});

describe("RatingsChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    useFetch.mockReturnValue({ data: null, loading: true, error: null });

    render(<RatingsChart tvshowId="1399" allocineUrl="test-url" />);

    expect(screen.getByText("Loading ratings insights...")).toBeInTheDocument();
  });

  it("renders tabbed metadata with global and season tabs", () => {
    useFetch.mockReturnValue({
      data: buildResponse(),
      loading: false,
      error: null,
    });

    render(<RatingsChart tvshowId="1399" allocineUrl="test-url" />);

    expect(screen.getByRole("heading", { name: "All" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "S1" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "S2" })).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "S3" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Distribution" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("S1 ratings evolution by episode"),
    ).toBeInTheDocument();
    expect(screen.getByText("All ratings distribution")).toBeInTheDocument();
    expect(screen.getByText("Show-level summary")).toBeInTheDocument();
    expect(screen.getByText("Show timeline")).toBeInTheDocument();
    expect(screen.getByText("Last episode")).toBeInTheDocument();
    expect(screen.getByText("Next episode")).toBeInTheDocument();
    expect(screen.getByText("S2E8: Last Ep")).toBeInTheDocument();
    expect(screen.getByText("S2E9: Next Ep")).toBeInTheDocument();

    const lineCharts = screen.getAllByTestId("chart-line");
    expect(
      lineCharts.some((chart) => chart.textContent === "S1,S2"),
    ).toBeTruthy();
    expect(
      lineCharts.some((chart) => chart.textContent === "S1,S2,S3"),
    ).toBeFalsy();
  });

  it("shows season highlight rating in dedicated column and not inline", () => {
    useFetch.mockReturnValue({
      data: buildResponse(),
      loading: false,
      error: null,
    });

    render(<RatingsChart tvshowId="1399" allocineUrl="test-url" />);

    expect(screen.getAllByText("S1E2: Ep2").length).toBeGreaterThan(0);
    expect(screen.queryByText("S1E2: Ep2 (9.9)")).not.toBeInTheDocument();
    expect(screen.getAllByText("9.9").length).toBeGreaterThan(0);
  });
});
