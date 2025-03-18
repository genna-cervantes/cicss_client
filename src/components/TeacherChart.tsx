import React from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface TeacherChartProps {
  five_count: number;
  four_count: number;
  three_count: number;
  two_count: number;
  one_count: number;
}

const TeacherChart: React.FC<TeacherChartProps> = ({
  five_count,
  four_count,
  three_count,
  two_count,
  one_count,
}) => {
  const data = {
    labels: ["5", "4", "3", "2", "1"],
    datasets: [
      {
        data: [five_count, four_count, three_count, two_count, one_count],
        backgroundColor: [
          "#FFBA21",
          "#0350D3",
          "#1972E4",
          "#3C96F1",
          "#77B9F4",
        ],
        borderWidth: 0.3,
        barThickness: 20,
        borderRadius: 15,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend (removes "undefined")
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Remove gridlines on x-axis
        },
      },

      y: {
        grid: {
          display: false, // Remove gridlines on y-axis
        },
        ticks: {
          display: false, // Hide y-axis labels
        },
      },
    },
  };

  return (
    <div>
      <div className="w-[180px] h-[173.5px] mx-auto">
        <Bar data={data} options={options}></Bar>
      </div>
    </div>
  );
};

export default TeacherChart;
