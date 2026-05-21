import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

jest.mock("./config", () => ({
  __esModule: true,
  default: {
    base_render_api: "https://health.test",
    umami_script_url: "",
    umami_website_id: "",
  },
}));

jest.mock("utils/useCacheBuster", () => jest.fn());
jest.mock("utils/useAnalyticsScript", () => jest.fn());
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

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    expect(screen.getByAltText(/Loading/i)).toBeInTheDocument();
    expect(screen.queryByText("SearchView")).not.toBeInTheDocument();
  });

  it("renders routes after a successful health check", async () => {
    mockFetch.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByText("SearchView")).toBeInTheDocument(),
    );
  });

  it.each([
    ["/", "SearchView"],
    ["/search", "SearchView"],
    ["/favorites", "FavoritesView"],
    ["/about", "AboutPage"],
    ["/movies", "SearchView"],
    ["/movies/123", "DetailView"],
  ])("renders route %s", async (path, text) => {
    mockFetch.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText(text)).toBeInTheDocument());
  });
});
