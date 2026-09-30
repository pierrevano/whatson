import { getParameters } from "./getParameters";

describe("getParameters", () => {
  it("adds directors and production companies filters", () => {
    const parameters = getParameters(
      undefined,
      "",
      undefined,
      "true,false",
      undefined,
      "movie,tvshow",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "",
      undefined,
      "Christopher Nolan, Greta Gerwig, ",
      undefined,
      "A24, Studio Ghibli, ",
    );

    expect(parameters).toContain(
      "directors=Christopher%20Nolan%2CGreta%20Gerwig",
    );
    expect(parameters).toContain("production_companies=A24%2CStudio%20Ghibli");
  });

  it.each([
    ...["asc", "desc"].flatMap((direction) => [
      {
        name: `legacy IMDb query (${direction})`,
        topRankingOrderQuery: direction,
        expectedSortBy: "top_ranking",
        expectedOrder: direction,
      },
      {
        name: `legacy IMDb preference (${direction})`,
        topRankingOrder: direction,
        expectedSortBy: "top_ranking",
        expectedOrder: direction,
      },
      {
        name: `legacy Mojo query (${direction})`,
        mojoRankOrderQuery: direction,
        expectedSortBy: "mojo_rank",
        expectedOrder: direction,
      },
      {
        name: `legacy Mojo preference (${direction})`,
        mojoRankOrder: direction,
        expectedSortBy: "mojo_rank",
        expectedOrder: direction,
      },
      ...["ratings", "popularity", "top_ranking", "mojo_rank"].map(
        (sortBy) => ({
          name: `new ${sortBy} query (${direction})`,
          sortBy,
          order: direction,
          expectedSortBy: sortBy,
          expectedOrder: direction,
        }),
      ),
      {
        name: `order-only query (${direction})`,
        order: direction,
        expectedSortBy: null,
        expectedOrder: direction,
      },
    ]),
    {
      name: "default sorting",
      expectedSortBy: null,
      expectedOrder: null,
    },
    {
      name: "empty legacy selections",
      topRankingOrderQuery: "",
      mojoRankOrderQuery: "",
      expectedSortBy: null,
      expectedOrder: null,
    },
    {
      name: "IMDb precedence when both legacy preferences are set",
      topRankingOrder: "asc",
      mojoRankOrder: "desc",
      expectedSortBy: "top_ranking",
      expectedOrder: "asc",
    },
    {
      name: "new sorting overrides legacy preferences",
      topRankingOrder: "asc",
      mojoRankOrder: "asc",
      sortBy: "mojo_rank",
      order: "desc",
      expectedSortBy: "mojo_rank",
      expectedOrder: "desc",
    },
    {
      name: "new sorting keeps the API default direction",
      topRankingOrder: "asc",
      sortBy: "ratings",
      expectedSortBy: "ratings",
      expectedOrder: null,
    },
    {
      name: "new direction overrides the legacy direction",
      topRankingOrder: "asc",
      order: "desc",
      expectedSortBy: "top_ranking",
      expectedOrder: "desc",
    },
  ])(
    "builds supported sorting parameters for $name",
    ({
      topRankingOrderQuery,
      topRankingOrder,
      mojoRankOrderQuery,
      mojoRankOrder,
      sortBy,
      order,
      expectedSortBy,
      expectedOrder,
    }) => {
      const parameters = getParameters(
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        topRankingOrderQuery,
        topRankingOrder,
        mojoRankOrderQuery,
        mojoRankOrder,
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        undefined,
        "",
        sortBy,
        order,
      );
      const query = new URLSearchParams(parameters);

      expect(query.get("sort_by")).toBe(expectedSortBy);
      expect(query.get("order")).toBe(expectedOrder);
      expect(query.has("top_ranking_order")).toBe(false);
      expect(query.has("mojo_rank_order")).toBe(false);
      expect(query.getAll("sort_by")).toHaveLength(expectedSortBy ? 1 : 0);
      expect(query.getAll("order")).toHaveLength(expectedOrder ? 1 : 0);
    },
  );
});
