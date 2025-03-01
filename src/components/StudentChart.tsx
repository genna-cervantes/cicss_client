import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface StudentChartProps {
  five_count: number;
  four_count: number;
  three_count: number;
  two_count: number;
  one_count: number;
}

const StudentChart: React.FC<StudentChartProps> = ({
  five_count,
  four_count,
  three_count,
  two_count,
  one_count,
}) => {
  const data = {
    labels: [],
    datasets: [
      {
        label: "Ratings",
        data: [
          0.5,
          five_count,
          0.5,
          four_count,
          0.5,
          three_count,
          0.5,
          two_count,
          0.5,
          one_count,
        ],
        backgroundColor: [
          "transparent",
          "#FFBA21",
          "transparent",
          "#0350D3",
          "transparent",
          "#1972E4",
          "transparent",
          "#3C96F1",
          "transparent",
          "#77B9F4",
        ],
        borderColor: "transparent",
        borderWidth: 6,
        borderRadius: 15,
      },
    ],
  };

  const options = {
    cutout: "78%",
  };

  return (
    <div className="w-48 h-48 mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StudentChart;
