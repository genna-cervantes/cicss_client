import React from "react";
import StudentChart from "./StudentChart";
import ratingLabel from "../assets/ratingLabel.png";

const StudentChartCard = () => {
  return (
    <div className="flex bg-custom_lightblue w-96 h-[370px] justify-evenly py-7 rounded-2xl shadow-xl">
      <div className="font-Manrope font-bold flex flex-col gap-3">
        Student Schedule Feedback
        <StudentChart
          five_count={5}
          four_count={4}
          three_count={3}
          two_count={2}
          one_count={1}
        />
      </div>
      <div>
        <img src={ratingLabel} alt="" className="h-52" />
      </div>
    </div>
  );
};

export default StudentChartCard;
