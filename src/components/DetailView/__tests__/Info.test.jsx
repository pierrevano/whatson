import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import Info from "../Info";
import * as theme from "../../../theme";

jest.mock("griding", () => ({
  Row: ({ children }) => <div data-testid="row">{children}</div>,
  Cell: ({ children }) => <div>{children}</div>,
}));

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

const renderInfo = (props = {}) => {
  const defaultProps = {
    kind: "person",
    combined_credits: { cast: [] },
    credits: { crew: [] },
  };

  return render(
    <ThemeProvider theme={theme}>
      <Info {...defaultProps} {...props} />
    </ThemeProvider>,
  );
};

const getLinkNames = (container) =>
  Array.from(container.querySelectorAll("a")).map(
    (link) => link.children[1]?.textContent?.trim() || "",
  );

describe("Info", () => {
  it("shows the four most popular unique cast entries from combined credits", () => {
    renderInfo({
      kind: "person",
      combined_credits: {
        cast: [
          { id: 1, title: "Franchise Reboot", popularity: 50 },
          { id: 2, title: "Indie Darling", popularity: 40 },
          { id: 1, title: "Franchise Reboot (Cameo)", popularity: 10 },
          { id: 3, title: "Comedy Hit", popularity: 35 },
          { id: 4, title: "Space Saga", popularity: 25 },
          { id: 5, title: "Straight-To-Video", popularity: 5 },
        ],
      },
      credits: { crew: [] },
    });

    const actedOnSection = screen.getByText("Acted on").parentElement;
    const names = getLinkNames(actedOnSection);

    expect(names).toEqual([
      "Franchise Reboot",
      "Indie Darling",
      "Comedy Hit",
      "Space Saga",
    ]);
    expect(
      screen.queryByText("Franchise Reboot (Cameo)"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Straight-To-Video")).not.toBeInTheDocument();
  });

  it("sorts and deduplicates directing credits by popularity", () => {
    renderInfo({
      kind: "movie",
      combined_credits: { cast: [] },
      credits: {
        crew: [
          {
            id: 10,
            name: "Ava Visionary",
            department: "Directing",
            popularity: 70,
          },
          {
            id: 11,
            name: "Chris Auteur",
            department: "Directing",
            popularity: 60,
          },
          {
            id: 10,
            name: "Ava Visionary (Guest)",
            department: "Directing",
            popularity: 20,
          },
          {
            id: 12,
            name: "Taylor Crew",
            department: "Production",
            popularity: 90,
          },
        ],
      },
    });

    const directorsSection = screen.getByText("Directors").parentElement;
    const names = getLinkNames(directorsSection);

    expect(names).toEqual(["Ava Visionary", "Chris Auteur"]);
    expect(screen.queryByText("Ava Visionary (Guest)")).not.toBeInTheDocument();
    expect(screen.queryByText("Taylor Crew")).not.toBeInTheDocument();
  });
});
