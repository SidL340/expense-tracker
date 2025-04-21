import React from "react";
import Chart from "react-apexcharts";

const options = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "50%",
      endingShape: "rounded",
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Income", "Expense", "Savings"],
  },
  yaxis: {
    title: {
      text: "Amount",
    },
  },
  fill: {
    opacity: 1,
    colors: ["#213ebf", "#FD5E53", "#22c55e"],
  },
  tooltip: {
    theme: "dark",
  },
};

export default function BarChart({ income = 0, expense = 0 }) {
  const savings = income - expense > 0 ? income - expense : 0;
  const series = [
    {
      name: "Amount",
      data: [income, expense, savings],
    },
  ];

  return (
    <div>
      <Chart options={options} series={series} type="bar" height={350} />
    </div>
  );
}
