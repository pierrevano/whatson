import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Navbar from "../index";
import * as theme from "../../../theme";
import { trackAnalyticsEvent } from "utils/analytics";

const mockLoginWithRedirect = jest.fn();
const mockLogout = jest.fn();
const mockUseAuth0 = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
  useAuth0: () => mockUseAuth0(),
}));

// SidebarFilters is a heavy child unrelated to the auth controls under test.
jest.mock("../SidebarFilters", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("utils/analytics", () => ({
  trackAnalyticsEvent: jest.fn(),
}));

// Render the Sidebar's children inline so the Logout control is reachable
// without driving the open/close visibility state.
jest.mock("primereact/sidebar", () => {
  const React = require("react");
  return {
    Sidebar: ({ children }) =>
      React.createElement("div", { "data-testid": "sidebar" }, children),
  };
});

const renderNavbar = () =>
  render(
    <MemoryRouter
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <ThemeProvider theme={theme}>
        <Navbar />
      </ThemeProvider>
    </MemoryRouter>,
  );

describe("Navbar auth0 controls", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the sign-in control and triggers loginWithRedirect when logged out", async () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: false,
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
    });

    renderNavbar();

    const signIn = await screen.findByLabelText(
      "Sign in",
      {},
      { timeout: 2000 },
    );
    fireEvent.click(signIn);

    expect(mockLoginWithRedirect).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByLabelText("You are connected"),
    ).not.toBeInTheDocument();
  });

  it("shows the connected indicator and wires logout when logged in", async () => {
    mockUseAuth0.mockReturnValue({
      isAuthenticated: true,
      loginWithRedirect: mockLoginWithRedirect,
      logout: mockLogout,
    });

    renderNavbar();

    expect(
      await screen.findByLabelText("You are connected", {}, { timeout: 2000 }),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Sign in")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Logout"));

    expect(mockLogout).toHaveBeenCalledWith({
      returnTo: window.location.origin,
    });
    expect(trackAnalyticsEvent).toHaveBeenCalledWith("logout_clicked");
  });
});
