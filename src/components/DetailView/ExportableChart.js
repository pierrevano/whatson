import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Chart } from "primereact/chart";
import * as theme from "../../theme";

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
  margin: 0px 1.5rem 0.25rem 0px;
`;

const ActionButton = styled.button`
  border: 1px solid ${theme.colors.midGrey};
  background: transparent;
  color: ${theme.colors.lightGrey};
  font-size: 0.8rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  &:hover {
    color: ${theme.colors.white};
    border-color: ${theme.colors.green};
  }
`;

const ChartWrapper = styled.div`
  width: 100%;
  overflow: hidden;

  .p-chart,
  .p-chart canvas {
    max-width: 100% !important;
    box-sizing: border-box;
  }
`;

const csvEscape = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const toCsv = (chartData = {}) => {
  const labels = Array.isArray(chartData.labels) ? chartData.labels : [];
  const datasets = Array.isArray(chartData.datasets) ? chartData.datasets : [];

  const header = [
    "Label",
    ...datasets.map(
      (dataset, index) => dataset?.label || `Series ${index + 1}`,
    ),
  ];

  const rows = labels.map((label, rowIndex) => [
    label,
    ...datasets.map((dataset) =>
      Array.isArray(dataset?.data) ? dataset.data[rowIndex] : "",
    ),
  ]);

  return [header, ...rows]
    .map((row) => row.map((cell) => csvEscape(cell)).join(","))
    .join("\n");
};

const toJson = (chartData = {}) => {
  const labels = Array.isArray(chartData.labels) ? chartData.labels : [];
  const datasets = Array.isArray(chartData.datasets) ? chartData.datasets : [];

  return JSON.stringify(
    {
      labels,
      datasets: datasets.map((dataset, index) => ({
        label: dataset?.label || `Series ${index + 1}`,
        data: Array.isArray(dataset?.data) ? dataset.data : [],
      })),
    },
    null,
    2,
  );
};

const downloadFile = ({ filename, content, mimeType }) => {
  const blob = new Blob([content], { type: mimeType });
  const href = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(href);
};

const buildWatermarkText = (watermarkTitle) =>
  watermarkTitle
    ? `What's on? - whatson-app.com - ${watermarkTitle}`
    : "What's on? - whatson-app.com";

const ExportableChart = ({
  type,
  data,
  options,
  filename,
  watermarkTitle,
  chartStyle,
}) => {
  const chartRef = useRef(null);
  const wrapperRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const updateWidth = () => {
      const nextWidth = Math.round(wrapper.getBoundingClientRect().width || 0);
      setContainerWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    };
    updateWidth();

    const observer =
      typeof ResizeObserver === "function"
        ? new ResizeObserver(updateWidth)
        : null;
    if (observer) observer.observe(wrapper);

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
      if (observer) observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current?.getChart?.();
    if (!chart || typeof chart.resize !== "function") return;
    chart.resize();
  }, [containerWidth, data, options]);

  const handleExportPng = () => {
    const chart = chartRef.current?.getChart?.();
    const sourceCanvas = chart?.canvas;
    if (!sourceCanvas) return;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = sourceCanvas.width;
    exportCanvas.height = sourceCanvas.height;

    const context = exportCanvas.getContext("2d");
    if (!context) return;

    context.drawImage(sourceCanvas, 0, 0);
    context.font = "500 16px sans-serif";
    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText(buildWatermarkText(watermarkTitle), 12, 8);

    const link = document.createElement("a");
    link.href = exportCanvas.toDataURL("image/png");
    link.download = `${filename}.png`;
    link.click();
  };

  const handleExportCsv = () => {
    downloadFile({
      filename: `${filename}.csv`,
      content: toCsv(data),
      mimeType: "text/csv;charset=utf-8;",
    });
  };

  const handleExportJson = () => {
    downloadFile({
      filename: `${filename}.json`,
      content: toJson(data),
      mimeType: "application/json;charset=utf-8;",
    });
  };

  return (
    <>
      <Actions>
        <ActionButton type="button" onClick={handleExportPng}>
          PNG
        </ActionButton>
        <ActionButton type="button" onClick={handleExportCsv}>
          CSV
        </ActionButton>
        <ActionButton type="button" onClick={handleExportJson}>
          JSON
        </ActionButton>
      </Actions>
      <ChartWrapper ref={wrapperRef}>
        <Chart
          key={`chart-${containerWidth || "auto"}`}
          ref={chartRef}
          type={type}
          data={data}
          options={options}
          style={{ width: "100%", ...chartStyle }}
        />
      </ChartWrapper>
    </>
  );
};

export default ExportableChart;
