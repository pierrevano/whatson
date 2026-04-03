import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExportableChart from "../ExportableChart";

let mockChartCanvas = { width: 320, height: 180 };

jest.mock("primereact/chart", () => {
  const React = require("react");

  return {
    Chart: React.forwardRef((props, ref) => {
      React.useImperativeHandle(ref, () => ({
        getChart: () => ({ canvas: mockChartCanvas }),
      }));

      return React.createElement("div", {
        "data-testid": "export-chart",
        "data-chart-type": props.type,
      });
    }),
  };
});

const baseProps = {
  type: "line",
  filename: "ratings-s1",
  watermarkTitle: "My Show",
  data: {
    labels: ["E1", "E2"],
    datasets: [{ label: "Episodes", data: [8.2, 8.6] }],
  },
  options: {},
};

const readBlobText = async (blob) => {
  if (typeof blob?.text === "function") return blob.text();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });
};

describe("ExportableChart", () => {
  beforeEach(() => {
    jest.restoreAllMocks();

    URL.createObjectURL = jest.fn(() => "blob:mock-url");
    URL.revokeObjectURL = jest.fn();

    mockChartCanvas = { width: 320, height: 180 };
  });

  it("renders the export controls", () => {
    render(<ExportableChart {...baseProps} />);

    expect(screen.getByRole("button", { name: "PNG" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CSV" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "JSON" })).toBeInTheDocument();
    expect(screen.getByTestId("export-chart")).toBeInTheDocument();
  });

  it("exports CSV and JSON with expected filenames and payloads", async () => {
    const anchors = [];
    const originalCreateElement = document.createElement.bind(document);

    jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "a") {
        const anchor = { href: "", download: "", click: jest.fn() };
        anchors.push(anchor);
        return anchor;
      }

      return originalCreateElement(tagName);
    });

    render(<ExportableChart {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "CSV" }));
    fireEvent.click(screen.getByRole("button", { name: "JSON" }));

    expect(URL.createObjectURL).toHaveBeenCalledTimes(2);
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);

    expect(anchors[0].download).toBe("ratings-s1.csv");
    expect(anchors[1].download).toBe("ratings-s1.json");

    const csvBlob = URL.createObjectURL.mock.calls[0][0];
    const jsonBlob = URL.createObjectURL.mock.calls[1][0];

    expect(csvBlob.type).toBe("text/csv;charset=utf-8;");
    expect(jsonBlob.type).toBe("application/json;charset=utf-8;");

    const csvText = await readBlobText(csvBlob);
    const jsonText = await readBlobText(jsonBlob);

    expect(csvText).toContain('"Label","Episodes"');
    expect(csvText).toContain('"E1","8.2"');

    const parsedJson = JSON.parse(jsonText);
    expect(parsedJson.labels).toEqual(["E1", "E2"]);
    expect(parsedJson.datasets[0].label).toBe("Episodes");
  });

  it("exports PNG with watermark text", () => {
    const fillText = jest.fn();
    const drawImage = jest.fn();

    const exportContext = {
      drawImage,
      fillText,
      font: "",
      fillStyle: "",
      textAlign: "",
      textBaseline: "",
    };

    const exportCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => exportContext),
      toDataURL: jest.fn(() => "data:image/png;base64,mock"),
    };

    const anchors = [];
    const originalCreateElement = document.createElement.bind(document);

    jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") return exportCanvas;

      if (tagName === "a") {
        const anchor = { href: "", download: "", click: jest.fn() };
        anchors.push(anchor);
        return anchor;
      }

      return originalCreateElement(tagName);
    });

    render(<ExportableChart {...baseProps} />);

    fireEvent.click(screen.getByRole("button", { name: "PNG" }));

    expect(drawImage).toHaveBeenCalledWith(mockChartCanvas, 0, 0);
    expect(fillText).toHaveBeenCalledWith(
      "What's on? - whatson-app.com - My Show",
      12,
      8,
    );
    expect(anchors[0].download).toBe("ratings-s1.png");
    expect(anchors[0].href).toBe("data:image/png;base64,mock");
  });

  it("exports PNG with base watermark when no title is provided", () => {
    const fillText = jest.fn();
    const drawImage = jest.fn();

    const exportContext = {
      drawImage,
      fillText,
      font: "",
      fillStyle: "",
      textAlign: "",
      textBaseline: "",
    };

    const exportCanvas = {
      width: 0,
      height: 0,
      getContext: jest.fn(() => exportContext),
      toDataURL: jest.fn(() => "data:image/png;base64,mock"),
    };

    const originalCreateElement = document.createElement.bind(document);

    jest.spyOn(document, "createElement").mockImplementation((tagName) => {
      if (tagName === "canvas") return exportCanvas;
      if (tagName === "a") return { href: "", download: "", click: jest.fn() };
      return originalCreateElement(tagName);
    });

    render(<ExportableChart {...baseProps} watermarkTitle={undefined} />);

    fireEvent.click(screen.getByRole("button", { name: "PNG" }));

    expect(fillText).toHaveBeenCalledWith(
      "What's on? - whatson-app.com",
      12,
      8,
    );
  });
});
