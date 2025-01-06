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
        data: [five_count, four_count, three_count, two_count, one_count],
        backgroundColor: [
          "#FFBA21",
          "#0350D3",
          "#1972E4",
          "#3C96F1",
          "#77B9F4",
        ],
        borderColor: "transparent",
      },
    ],
  };

  const options = {
    cutout: "71%",
  };

  return (
    <div className="w-[80%] h-[80%] mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StudentChart;
