import { createFilters } from "../createFilters";
import config from "../../../config";

describe("createFilters ratings", () => {
  const filters = createFilters(config);
  const ratingCodes = filters.ratings.items.map((item) => item.code);

  it("exposes every ratings source", () => {
    expect(ratingCodes).toEqual(
      expect.arrayContaining([
        "allocine_critics",
        "allocine_users",
        "betaseries_users",
        "imdb_users",
        "letterboxd_users",
        "metacritic_critics",
        "metacritic_users",
        "rottentomatoes_critics",
        "rottentomatoes_users",
        "senscritique_users",
        "tmdb_users",
        "trakt_users",
      ]),
    );
  });

  it("does not expose a TV Time ratings filter", () => {
    expect(ratingCodes).not.toContain("tvtime_users");
    expect(
      filters.ratings.items.some((item) => /tv ?time/i.test(item.name)),
    ).toBe(false);
  });

  it("keeps config.ratings and config.ratings_names free of TV Time and the same length", () => {
    expect(config.ratings).not.toMatch(/tvtime/i);
    expect(config.ratings_names).not.toMatch(/tv ?time/i);
    expect(config.ratings.split(",")).toHaveLength(
      config.ratings_names.split(",").length,
    );
  });
});
