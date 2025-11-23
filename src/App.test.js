import React from "react";
import "@testing-library/jest-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@reach/router";
import App from "./App";

jest.mock("./config", () => ({
  __esModule: true,
  default: {
    base_render_api: "https://health.test",
    base_beamanalytics: "",
    beamanalytics_token: "",
  },
}));

jest.mock("utils/useCacheBuster", () => jest.fn());
jest.mock("utils/useScript", () => jest.fn());
jest.mock("utils/consoleMessage", () => jest.fn());

jest.mock("components/Navbar", () => ({
  __esModule: true,
  default: () => <div>Navbar</div>,
}));
jest.mock("components/Footer", () => ({
  __esModule: true,
  default: () => <div>Footer</div>,
}));
jest.mock("components/SearchView", () => ({
  __esModule: true,
  default: () => <div>SearchView</div>,
}));
jest.mock("components/FavoritesView", () => ({
  __esModule: true,
  default: () => <div>FavoritesView</div>,
}));
jest.mock("components/DetailView", () => ({
  __esModule: true,
  default: () => <div>DetailView</div>,
}));
jest.mock("components/AboutPage", () => ({
  __esModule: true,
  default: () => <div>AboutPage</div>,
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("App bootstrap", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("keeps the loader visible when the health check is not 200 (navigation freeze)", async () => {
    mockFetch.mockResolvedValueOnce({ status: 500 });

    render(<App />);

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
    expect(screen.queryByText("SearchView")).not.toBeInTheDocument();
  });

  it("renders routes after a successful health check", async () => {
    mockFetch.mockResolvedValueOnce({ status: 200 });

    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("SearchView")).toBeInTheDocument(),
    );
  });

  it("renders each public route when navigating", async () => {
    const routes = [
      { path: "/", text: "SearchView" },
      { path: "/search", text: "SearchView" },
      { path: "/favorites", text: "FavoritesView" },
      { path: "/about", text: "AboutPage" },
      { path: "/movies", text: "SearchView" },
      { path: "/movies/123", text: "DetailView" },
    ];

    for (const { path, text } of routes) {
      mockFetch.mockReset();
      mockFetch.mockResolvedValue({ status: 200 });
      const history = createHistory(createMemorySource(path));

      render(
        <LocationProvider history={history}>
          <App />
        </LocationProvider>,
      );

      await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());

      cleanup();
    }
  });
});
