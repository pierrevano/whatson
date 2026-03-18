import config from "../../../config";
import { createFilters } from "../createFilters";
import { initializeSelectedItems } from "../initializeSelectedItems";

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function replaceAll(searchValue, replaceValue) {
    return this.split(searchValue).join(replaceValue);
  };
}

const filters = createFilters(config);

const buildSelectedMap = (storedValues = {}) => {
  const profile = {
    genres: "",
    minimum_ratings: "",
    must_see: "",
    platforms: "",
    popularity_filters: "",
    ratings_filters: "",
    release_date: "",
    status: "",
    seasons_number: "",
    ...storedValues,
  };

  const selectedItems = initializeSelectedItems(
    filters.genres,
    profile.genres,
    filters.minimum_ratings,
    profile.minimum_ratings,
    filters.must_see,
    profile.must_see,
    filters.platforms,
    profile.platforms,
    filters.popularity,
    profile.popularity_filters,
    filters.ratings,
    profile.ratings_filters,
    filters.release_date,
    profile.release_date,
    filters.status,
    profile.status,
    filters.seasons,
    profile.seasons_number,
  );

  return selectedItems.reduce((accumulator, item) => {
    if (!accumulator[item.origin]) {
      accumulator[item.origin] = [];
    }

    accumulator[item.origin].push(item.code);
    return accumulator;
  }, {});
};

describe("initializeSelectedItems regressions", () => {
  it("keeps custom genre subsets and single minimum ratings selections", () => {
    const selectedMap = buildSelectedMap({
      genres:
        "Drama,Crime,Mystery,Sci-Fi & Fantasy,Action & Adventure,Comedy,War & Politics,Family,Animation,Western",
      minimum_ratings: "3.5",
    });

    expect(selectedMap.genres).toEqual(
      expect.arrayContaining([
        "Drama",
        "Crime",
        "Mystery",
        "Sci-Fi & Fantasy",
        "Action & Adventure",
        "Comedy",
        "War & Politics",
        "Family",
        "Animation",
        "Western",
      ]),
    );
    expect(selectedMap.genres).not.toContain("Reality");
    expect(selectedMap.minimum_ratings).toEqual(["3.5"]);
    expect(selectedMap.popularity || []).toEqual([]);
    expect(selectedMap.release_date || []).toEqual([]);
  });

  it("does not reactivate the must-see chip from legacy false-only storage", () => {
    const selectedMap = buildSelectedMap({
      must_see: "false",
      release_date: "everything",
    });

    expect(selectedMap.must_see || []).toEqual([]);
    expect(selectedMap.release_date).toEqual(["everything"]);
    expect(selectedMap.release_date).not.toContain("new");
  });

  it("keeps recent-items release date storage compatible with the new chip UI", () => {
    const selectedMap = buildSelectedMap({
      release_date: "everything,new",
    });

    expect(selectedMap.release_date).toEqual(
      expect.arrayContaining(["everything", "new"]),
    );
  });

  it("preserves popularity filters stored without the legacy enabled token", () => {
    const selectedMap = buildSelectedMap({
      popularity_filters: "allocine_popularity,imdb_popularity,tmdb_popularity",
    });

    expect(selectedMap.popularity).toEqual([
      "allocine_popularity",
      "imdb_popularity",
      "tmdb_popularity",
    ]);
    expect(selectedMap.popularity).not.toContain("enabled");
  });

  it("expands all for genres and platforms back into chip selections", () => {
    const selectedMap = buildSelectedMap({
      genres: "all",
      platforms: "all",
    });

    expect(selectedMap.genres).toEqual(
      expect.arrayContaining(
        filters.genres.items
          .filter((item) => item.code !== "allgenres")
          .map((item) => item.code),
      ),
    );
    expect(selectedMap.platforms).toEqual(
      expect.arrayContaining(
        filters.platforms.items
          .filter((item) => item.code !== "all")
          .map((item) => item.code),
      ),
    );
  });

  it("keeps legacy full-profile filter strings readable by the parser", () => {
    const selectedMap = buildSelectedMap({
      genres: "Drama,Crime,Mystery,Sci-Fi & Fantasy,Action & Adventure,Comedy",
      minimum_ratings: "4.5,4.0,3.5,3.0,2.5,2.0,1.0,0.0",
      platforms:
        "Canal+ Ciné Séries,Netflix,Prime Video,Max,Disney+,Paramount+",
      popularity_filters: "enabled,allocine_popularity,imdb_popularity",
      ratings_filters:
        "allocine_critics,allocine_users,betaseries_users,imdb_users",
      release_date: "everything",
      seasons_number: "1,2,3,4,5",
      status: "canceled,ended,ongoing,pilot,unknown",
    });

    expect(selectedMap.minimum_ratings).toEqual(
      expect.arrayContaining([
        "4.5",
        "4.0",
        "3.5",
        "3.0",
        "2.5",
        "2.0",
        "1.0",
        "0.0",
      ]),
    );
    expect(selectedMap.platforms).toEqual(
      expect.arrayContaining([
        "Canal+ Ciné Séries",
        "Netflix",
        "Prime Video",
        "Max",
        "Disney+",
        "Paramount+",
      ]),
    );
    expect(selectedMap.popularity).toEqual(
      expect.arrayContaining([
        "enabled",
        "allocine_popularity",
        "imdb_popularity",
      ]),
    );
    expect(selectedMap.ratings).toEqual(
      expect.arrayContaining([
        "allocine_critics",
        "allocine_users",
        "betaseries_users",
        "imdb_users",
      ]),
    );
    expect(selectedMap.seasons).toEqual(["1", "2", "3", "4", "5"]);
    expect(selectedMap.status).toEqual(
      expect.arrayContaining([
        "canceled",
        "ended",
        "ongoing",
        "pilot",
        "unknown",
      ]),
    );
  });
});
