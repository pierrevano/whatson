import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import Relation from "../Relation";
import * as theme from "../../../theme";

jest.mock("components/Link", () => {
  const MockLink = ({ children, to, ...props }) => {
    const href = typeof to === "string" ? to : to?.pathname || "/";
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

const renderRelation = (props = {}) => {
  const defaultProps = {
    id: 42,
    kind: "person",
    title: "Sample Credit",
  };

  return render(
    <ThemeProvider theme={theme}>
      <Relation {...defaultProps} {...props} />
    </ThemeProvider>,
  );
};

describe("Relation", () => {
  it("links person credits pointing to TV shows when media_type is tv", () => {
    renderRelation({ id: 99, media_type: "tv" });

    const link = screen.getByRole("link", { name: /Sample Credit/i });
    expect(link.getAttribute("href")).toBe("/tvshows/99");
  });

  it("links person credits pointing to movies when media_type is movie", () => {
    renderRelation({ id: 12, media_type: "movie" });

    const link = screen.getByRole("link", { name: /Sample Credit/i });
    expect(link.getAttribute("href")).toBe("/movies/12");
  });

  it("defaults person credits without media_type to movies", () => {
    renderRelation({ id: 55, media_type: undefined });

    const link = screen.getByRole("link", { name: /Sample Credit/i });
    expect(link.getAttribute("href")).toBe("/movies/55");
  });

  it("links non-person credits to the related person entry", () => {
    renderRelation({ id: 75, kind: "movie" });

    const link = screen.getByRole("link", { name: /Sample Credit/i });
    expect(link.getAttribute("href")).toBe("/people/75");
  });
});
