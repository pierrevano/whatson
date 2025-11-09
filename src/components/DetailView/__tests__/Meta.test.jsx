import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import Meta from "../Meta";
import * as theme from "../../../theme";

const renderMeta = (props = {}) => {
  const defaultProps = {
    certification_from_render: "PG-13",
    release_date_from_render: "1999-03-31",
    runtime_from_render: 7200,
    seasons_number_from_render: 2,
    status_from_render: "Ongoing",
  };

  return render(
    <ThemeProvider theme={theme}>
      <Meta {...defaultProps} {...props} />
    </ThemeProvider>,
  );
};

describe("Meta", () => {
  it("renders all metadata values and certification badge when provided", () => {
    renderMeta();

    expect(screen.getByText("1999")).toBeInTheDocument();
    expect(screen.getByText("120 min")).toBeInTheDocument();
    expect(screen.getByText("2 seasons")).toBeInTheDocument();
    expect(screen.getByText("Ongoing")).toBeInTheDocument();
    expect(screen.getByText("PG-13")).toBeInTheDocument();
  });

  it("omits values and certification when metadata is missing", () => {
    renderMeta({
      certification_from_render: null,
      release_date_from_render: null,
      runtime_from_render: null,
      seasons_number_from_render: null,
      status_from_render: null,
    });

    expect(screen.queryByText("1999")).not.toBeInTheDocument();
    expect(screen.queryByText(/min/)).not.toBeInTheDocument();
    expect(screen.queryByText(/season/)).not.toBeInTheDocument();
    expect(screen.queryByText("Ongoing")).not.toBeInTheDocument();
    expect(screen.queryByText("PG-13")).not.toBeInTheDocument();
    expect(screen.queryByTestId("meta-wrapper")).not.toBeInTheDocument();
  });

  it("handles singular season label", () => {
    renderMeta({ seasons_number_from_render: 1 });

    expect(screen.getByText("1 season")).toBeInTheDocument();
  });
});
