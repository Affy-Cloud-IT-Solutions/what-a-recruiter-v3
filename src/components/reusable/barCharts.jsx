// RecruiterDoughnutChart.jsx
import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const RecruiterDoughnutChart = () => {
  const data = {
    labels: ["Total", "Shortlisted", "Interviewed", "Offered", "Hired"],
    datasets: [
      {
        label: "Candidates",
        data: [100, 40, 30, 20, 10], // Replace with real data
        backgroundColor: [
          "#FF6384", // Total
          "#36A2EB", // Shortlisted
          "#FFCE56", // Interviewed
          "#4BC0C0", // Offered
          "#9966FF", // Hired
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      title: {
        display: true,
        text: "Recruitment Funnel Overview",
      },
    },
  };

  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default RecruiterDoughnutChart;
