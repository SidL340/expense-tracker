import Chart from "react-apexcharts";

const options = {
  labels: ["Savings", "Expense"],
  colors: ["#213ebf","#FD5E53"],
  chart: {
    width: "50px",
  },
  states: {
    hover: {
      filter: {
        type: "none",
      },
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  hover: { mode: null },
  plotOptions: {
    donut: {
      expandOnClick: false,
      donut: {
        labels: {
          show: false,
        },
      },
    },
  },
  fill: {
    colors: ["#213ebf","#FD5E53"],
  },
  tooltip: {
    enabled: true,
    theme: "dark",
    style: {
      fontSize: "12px",
      fontFamily: undefined,
      backgroundColor: "#000000",
    },
  },
};

export default function TransactionChartSummary({expense = 100, income = 100}) {
  const savings = income - expense > 0 ? income - expense : 0;
  return (
    <Chart
      options={options}
      series={[savings, expense]}
      type="pie"
      width={"100%"}
      height={"100%"}
    />
  );
}
