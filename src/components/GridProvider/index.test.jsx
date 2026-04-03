import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { ThemeProvider, useTheme } from "styled-components";
import GridProvider from ".";

const ThemeProbe = () => {
  const theme = useTheme();

  return (
    <div>
      <div>{theme.colors.red}</div>
      <div>{theme.griding.columns}</div>
      <div>{theme.griding.breakpoints.md.gutter}</div>
    </div>
  );
};

describe("GridProvider", () => {
  it("preserves the parent theme while adding griding values", () => {
    render(
      <ThemeProvider theme={{ colors: { red: "#f00" } }}>
        <GridProvider
          columns={12}
          breakpoints={{ md: { gutter: 20, width: "48rem" } }}
        >
          <ThemeProbe />
        </GridProvider>
      </ThemeProvider>,
    );

    expect(screen.getByText("#f00")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
  });
});
