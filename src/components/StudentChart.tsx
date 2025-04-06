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
  // Check if all counts are 0
  const allZero = five_count === 0 && four_count === 0 && three_count === 0 && two_count === 0 && one_count === 0;

  const data = {
    labels: allZero ? ["No Ratings"] : [],
    datasets: [
      {
        label: "Ratings",
        data: allZero
          ? [1] // Only show "No Ratings" if all counts are zero
          : [
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
        backgroundColor: allZero
          ? ["#E0E0E0"] // Grey for "No Ratings"
          : [
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
    <div className="w-[90%] h-[90%] mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StudentChart;
