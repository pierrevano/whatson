import { breakpoints } from "./theme";

describe("theme breakpoints", () => {
  it("all widths are numbers so griding generates valid px media queries", () => {
    const entries = Object.values(breakpoints);
    expect.assertions(entries.length);
    entries.forEach(({ width }) => {
      expect(typeof width).toBe("number");
    });
  });
});
