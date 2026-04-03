jest.mock("../config", () => ({
  __esModule: true,
  default: {
    base: "https://api.themoviedb.org/3",
    api: "test-api-key",
  },
}));

import { importImdbWatchlist } from "./importImdbWatchlist";

const createCsvFile = (contents, name = "watchlist.csv") => ({
  name,
  size: contents.length,
  text: async () => contents,
});

describe("importImdbWatchlist", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("imports IMDb ids from the CSV and resolves unique TMDB favorites", async () => {
    const csv = [
      "\uFEFFPosition,Const,Created,Title",
      "1,tt1234567,2024-01-01,First title",
      "2,tt7654321,2024-01-02,Second title",
      "3,tt1234567,2024-01-03,Duplicate title",
    ].join("\n");

    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          movie_results: [{ id: 101 }],
          tv_results: [],
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          movie_results: [],
          tv_results: [{ id: 202 }],
        }),
      });

    const result = await importImdbWatchlist({
      file: createCsvFile(csv),
    });

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenNthCalledWith(
      1,
      "https://api.themoviedb.org/3/find/tt1234567?api_key=test-api-key&external_source=imdb_id",
    );
    expect(global.fetch).toHaveBeenNthCalledWith(
      2,
      "https://api.themoviedb.org/3/find/tt7654321?api_key=test-api-key&external_source=imdb_id",
    );
    expect(result).toEqual({
      favorites: ["movies/101", "tvshows/202"],
      unmatched: [],
      total: 2,
    });
  });

  it("rejects CSV files that do not contain the IMDb const column", async () => {
    const csv = ["Position,Title,Created", "1,First title,2024-01-01"].join(
      "\n",
    );

    await expect(
      importImdbWatchlist({
        file: createCsvFile(csv),
      }),
    ).rejects.toThrow(
      "We could not find the title column in that CSV. Please export the watchlist again from IMDb.",
    );

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
