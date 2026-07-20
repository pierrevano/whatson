import { getRatingsDetails } from "utils/getRatingsDetails";

// Positional arguments in the exact order of the getRatingsDetails signature.
// Distinct rating values let us assert each source maps to the right row and that
// the trailing mojo arguments stay aligned with the signature.
const buildArgs = () => [
  4, // allocine_critics_rating
  "https://www.allocine.fr/film/1", // allocine_url
  3.5, // allocine_users_rating
  100, // allocine_users_rating_count
  20, // allocine_critics_rating_count
  "bs-url", // betaseries_url
  4.2, // betaseries_users_rating
  200, // betaseries_users_rating_count
  "imdb-url", // imdb_url
  8.5, // imdb_users_rating
  1000, // imdb_users_rating_count
  "lb-url", // letterboxd_url
  4.1, // letterboxd_users_rating
  300, // letterboxd_users_rating_count
  88, // metacritic_critics_rating
  "mc-url", // metacritic_url
  7.9, // metacritic_users_rating
  400, // metacritic_users_rating_count
  30, // metacritic_critics_rating_count
  95, // rottentomatoes_critics_rating
  "rt-url", // rottentomatoes_url
  90, // rottentomatoes_users_rating
  500, // rottentomatoes_users_rating_count
  40, // rottentomatoes_critics_rating_count
  "sc-url", // senscritique_url
  7.5, // senscritique_users_rating
  600, // senscritique_users_rating_count
  "tmdb-url", // tmdb_url
  8.1, // tmdb_users_rating
  700, // tmdb_users_rating_count
  "trakt-url", // trakt_url
  82, // trakt_users_rating
  800, // trakt_users_rating_count
  42, // mojo_rank
  "mojo-url", // mojo_url
];

const rowByName = (detailsData, name) =>
  detailsData.find((row) => row.name === name);

describe("getRatingsDetails", () => {
  it("does not produce a TV Time row", () => {
    const { detailsData } = getRatingsDetails(...buildArgs());

    expect(rowByName(detailsData, "TV Time users")).toBeUndefined();
    expect(detailsData.some((row) => /tv ?time/i.test(row.name))).toBe(false);
  });

  it("renders every rating source with the correct value", () => {
    const { detailsData } = getRatingsDetails(...buildArgs());
    const names = detailsData.map((row) => row.name);

    expect(names).toEqual(
      expect.arrayContaining([
        "AlloCiné users",
        "AlloCiné critics",
        "BetaSeries users",
        "IMDb users",
        "Letterboxd users",
        "Metacritic users",
        "Metacritic critics",
        "Rotten Tomatoes users",
        "Rotten Tomatoes critics",
        "SensCritique users",
        "TMDB users",
        "Trakt users",
      ]),
    );
    expect(rowByName(detailsData, "IMDb users").rating).toBe(8.5);
    // Trakt is the last rating argument, immediately before mojo.
    expect(rowByName(detailsData, "Trakt users").rating).toBe(82);
  });

  it("keeps the mojo arguments aligned with the signature", () => {
    const { mojoDetailsData } = getRatingsDetails(...buildArgs());

    // mojo_rank is the argument immediately after the ratings; a misalignment
    // would land trakt's rating count (800) here instead of 42.
    expect(mojoDetailsData).toHaveLength(1);
    expect(mojoDetailsData[0].name).toBe("Mojo worldwide");
    expect(mojoDetailsData[0].rank).toBe(42);
  });
});
