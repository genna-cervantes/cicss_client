import React from "react";
import StudentChart from "./StudentChart";
import ratingLabel from "../assets/ratingLabel.png";

const StudentChartCard = () => {
  return (
    <div className="bg-custom_lightblue w-96 h-[370px] py-9 rounded-2xl shadow-xl font-Manrope">
      <div className="flex flex-col gap-9 items-center">
        <div>
          <div className="flex justify-evenly gap-6 items-center">
            <div className=" font-bold flex flex-col gap-3">
              Student Schedule Feedback
              <StudentChart
                five_count={10}
                four_count={4}
                three_count={5}
                two_count={3}
                one_count={6}
              />
            </div>

            <img src={ratingLabel} alt="" className="h-56" />
          </div>
        </div>

        <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary">
          See More
        </button>
      </div>
    </div>
  );
};

export default StudentChartCard;
