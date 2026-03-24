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
});
