import React from "react";
import StudentChart from "./StudentChart";
import ratingLabel from "../assets/ratingLabel.png";

const StudentChartCard = () => {
  return (
    <div className="bg-custom_lightblue rounded-2xl shadow-xl font-Manrope py-9 justify-between">
      <div className="flex flex-col items-center space-y-12 px-2 ">
        <div className="flex justify-evenly space-x-8 items-center">
          <div className="font-bold flex flex-col ">
            Student <br></br>Schedule Feedback
            <StudentChart
              five_count={10}
              four_count={4}
              three_count={5}
              two_count={3}
              one_count={6}
            />
          </div>
          <img
            src={ratingLabel}
            alt=""
            className="h-56 md:hidden lg:block overflow-hidden "
          />
        </div>

        <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary">
          See More
        </button>
      </div>
    </div>
  );
};

export default StudentChartCard;
