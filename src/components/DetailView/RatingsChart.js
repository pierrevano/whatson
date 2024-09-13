import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import * as theme from "../../theme";

const RatingsChart = ({ ratings, episodeDetails, titles }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const data = {
      labels: episodeDetails.map((ep) => `S${ep.season}E${ep.episode}`),
      datasets: [
        {
          label: "IMDb episodes users ratings",
          data: ratings,
          backgroundColor: `${theme.colors.dark}`,
          borderColor: `${theme.colors.green}`,
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: `${theme.colors.lightGrey}`,
          },
        },
        x: {
          ticks: {
            color: `${theme.colors.lightGrey}`,
          },
        },
      },
      plugins: {
        tooltip: {
          position: "nearest",
          callbacks: {
            title: (tooltipItems) => {
              const index = tooltipItems[0].dataIndex;
              const ep = episodeDetails[index];
              return `S${ep.season}E${ep.episode}: ${titles[index]}`;
            },
          },
          yAlign: "bottom",
          xAlign: "center",
        },
        legend: {
          display: false,
          labels: {
            color: `${theme.colors.lightGrey}`,
          },
        },
      },
    };

    setChartData(data);
    setChartOptions(options);
  }, [ratings, episodeDetails, titles]);

  return <Chart type="line" data={chartData} options={chartOptions} />;
};

export default RatingsChart;
