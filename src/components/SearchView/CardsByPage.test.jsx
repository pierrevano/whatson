import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import useFetchWithStatusCode from "utils/useFetchWithStatusCode";
import CardsByPage from "./CardsByPage";

jest.mock("query-string", () => ({
  __esModule: true,
  default: {
    parse: jest.fn(() => ({})),
  },
}));

jest.mock("griding", () => ({
  Cell: ({ children }) => <div>{children}</div>,
}));

jest.mock("react-intersection-observer", () => ({
  useInView: () => [jest.fn(), false],
}));

jest.mock("components/Card", () => () => <div>Card</div>);

jest.mock("components/InfoScreen", () => ({ title, description }) => (
  <div>
    <div>{title}</div>
    <div>{description}</div>
  </div>
));

jest.mock("utils/useStorageString", () => ({
  useStorageString: (_key, initialValue = "") => [initialValue, jest.fn()],
}));

jest.mock("utils/useFetchWithStatusCode", () => jest.fn());

describe("CardsByPage", () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    jest.clearAllMocks();
    Math.random = jest.fn(() => 0);
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it("shows the error message on the first page when filters return 404 without a search term", () => {
    useFetchWithStatusCode.mockReturnValue({
      data: null,
      error: new Error("Network response was not ok"),
      isLoading: false,
    });

    render(
      <CardsByPage
        search=""
        page={1}
        setPage={jest.fn()}
        isLastPage={true}
        kindURL="multi"
      />,
    );

    expect(screen.getByText("I’m sorry Dave.")).toBeInTheDocument();
    expect(screen.getByText("I’m afraid I can’t do that.")).toBeInTheDocument();
  });
});
