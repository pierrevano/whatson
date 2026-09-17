import "@testing-library/jest-dom";
import DetailView from "../index";
import { render } from "@testing-library/react";
import { useFetch } from "react-hooks-fetch";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";

jest.mock("../../../config", () => ({
  __esModule: true,
  default: {
    api: "tmdb-key",
    base: "https://tmdb.test",
    base_render_api: "https://api.test",
    base_render_api_key: "website-key",
  },
}));

jest.mock("query-string", () => ({
  __esModule: true,
  default: { parse: () => ({}) },
}));

jest.mock("components/ToggleButton", () => () => null);
jest.mock("react-hooks-fetch", () => ({ useFetch: jest.fn() }));
jest.mock("react-player", () => () => null);
jest.mock("utils/analytics", () => ({ trackAnalyticsEvent: jest.fn() }));
jest.mock("utils/useFetchWithStatusCode", () => jest.fn());
jest.mock("utils/useStorageString", () => ({
  useStorageString: (_key, initialValue = "") => [initialValue, jest.fn()],
}));

describe("DetailView", () => {
  it("requests item details with supported query parameters", () => {
    useFetch.mockReturnValue({ data: null, error: null, loading: true });
    useFetchWithStatusCode.mockReturnValue({ data: null });

    render(<DetailView id="550" kindURL="movies" />);

    const requestUrl = new URL(useFetchWithStatusCode.mock.calls[0][0]);
    expect(requestUrl.pathname).toBe("/movie/550");
    expect(requestUrl.searchParams.get("append_to_response")).toBe(
      "episodes_details,last_episode,next_episode,highest_episode,lowest_episode,platforms_links",
    );
    expect(requestUrl.searchParams.get("ratings_filters")).toBe("all");
    expect(requestUrl.searchParams.get("api_key")).toBe("website-key");
    expect([...requestUrl.searchParams.keys()].sort()).toEqual([
      "api_key",
      "append_to_response",
      "ratings_filters",
    ]);
  });
});
