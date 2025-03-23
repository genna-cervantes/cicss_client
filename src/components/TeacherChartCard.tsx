import React from "react";
import TeacherChart from "./TeacherChart";
import { useNavigate } from "react-router-dom";

const TeacherChartCard = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-custom_lightblue rounded-2xl shadow-xl font-Manrope py-6 lg:py-8 xl:py-10 h-full">
      <div className="flex flex-col items-center justify-between h-full px-3 lg:px-4">
        <div className="flex justify-center items-center w-full">
          <div className="font-bold flex flex-col">
            <span className="text-base lg:text-lg xl:text-xl">
              Teaching Staff
              <br />
              Schedule Feedback
            </span>
            <div className="mt-2 lg:mt-3 xl:mt-4">
              <TeacherChart
                five_count={100}
                four_count={70}
                three_count={50}
                two_count={35}
                one_count={10}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/departmentchair/ratings")}
          className="border-2 border-primary py-1 px-1 w-36 lg:w-40 xl:w-44 font-semibold text-primary text-sm lg:text-base xl:text-lg mt-6 lg:mt-8 hover:bg-primary hover:text-white transition duration-300"
        >
          See More
        </button>
      </div>
    </div>
  );
};

export default TeacherChartCard;
