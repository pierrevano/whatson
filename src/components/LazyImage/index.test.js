import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LazyImage from ".";

describe("LazyImage", () => {
  it("renders the source immediately when the placeholder matches", () => {
    render(
      <LazyImage placeholder="poster.jpg" src="poster.jpg">
        {(src, loading) => (
          <img alt="Poster" src={src} data-loading={String(loading)} />
        )}
      </LazyImage>,
    );

    expect(screen.getByAltText("Poster")).toHaveAttribute("src", "poster.jpg");
    expect(screen.getByAltText("Poster")).toHaveAttribute(
      "data-loading",
      "false",
    );
  });
});
