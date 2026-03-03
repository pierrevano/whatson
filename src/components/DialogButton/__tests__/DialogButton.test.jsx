import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider } from "styled-components";
import DialogButton from "../index";
import * as theme from "../../../theme";

const renderDialogButton = (props = {}) => {
  const defaultProps = {
    setValues: jest.fn(),
    itemKey: "chart",
  };

  return render(
    <ThemeProvider theme={theme}>
      <DialogButton {...defaultProps} {...props} />
    </ThemeProvider>,
  );
};

describe("DialogButton", () => {
  it("shows chart button label for ratings insights", () => {
    renderDialogButton({ itemKey: "chart" });

    expect(screen.getByText("Season ratings insights")).toBeInTheDocument();
  });

  it("shows trailer button label for trailer mode", () => {
    renderDialogButton({ itemKey: "trailer" });

    expect(screen.getByText("Watch trailer")).toBeInTheDocument();
  });

  it("calls the click handler", () => {
    const setValues = jest.fn();
    renderDialogButton({ setValues });

    fireEvent.click(
      screen.getByRole("button", {
        name: "Season ratings insights",
      }),
    );

    expect(setValues).toHaveBeenCalledTimes(1);
  });
});
