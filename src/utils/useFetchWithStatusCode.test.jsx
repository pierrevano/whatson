import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import useFetchWithStatusCode from "./useFetchWithStatusCode";

const TestComponent = ({ url }) => {
  const { data, error, isLoading, statusCode } = useFetchWithStatusCode(url);

  return (
    <div>
      <div>{isLoading ? "loading" : "idle"}</div>
      <div>{statusCode === null ? "no-status" : statusCode}</div>
      <div>{error ? "has-error" : "no-error"}</div>
      <div>{data?.message || "no-data"}</div>
    </div>
  );
};

describe("useFetchWithStatusCode", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it("clears previous error state when a new request succeeds", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ message: "ok" }),
      });

    const { rerender } = render(<TestComponent url="/first" />);

    await waitFor(() => expect(screen.getByText("404")).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByText("has-error")).toBeInTheDocument(),
    );

    rerender(<TestComponent url="/second" />);

    await waitFor(() =>
      expect(screen.getByText("loading")).toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByText("200")).toBeInTheDocument());
    await waitFor(() =>
      expect(screen.getByText("no-error")).toBeInTheDocument(),
    );
    await waitFor(() => expect(screen.getByText("ok")).toBeInTheDocument());
  });

  it("clears state when the request URL becomes null", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: "loaded" }),
    });

    const { rerender } = render(<TestComponent url="/first" />);

    await waitFor(() => expect(screen.getByText("200")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("loaded")).toBeInTheDocument());

    rerender(<TestComponent url={null} />);

    await waitFor(() =>
      expect(screen.getByText("no-status")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText("no-error")).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(screen.getByText("no-data")).toBeInTheDocument(),
    );
    expect(screen.getByText("idle")).toBeInTheDocument();
  });
});
