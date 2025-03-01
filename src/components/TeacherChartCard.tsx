import React from "react";
import TeacherChart from "./TeacherChart";

const TeacherChartCard = () => {
  return (
    <div className="bg-custom_lightblue rounded-2xl shadow-xl font-Manrope py-9">
      <div className="flex flex-col items-center space-y-10">
        <div className="flex justify-evenly items-center">
          <div className=" font-bold flex flex-col space-y-2">
            Teaching Staff<br></br> Schedule Feedback
            <TeacherChart
              five_count={100}
              four_count={70}
              three_count={50}
              two_count={35}
              one_count={10}
            />
          </div>
        </div>

        <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary">
          See More
        </button>
      </div>
    </div>
  );
};

export default TeacherChartCard;
