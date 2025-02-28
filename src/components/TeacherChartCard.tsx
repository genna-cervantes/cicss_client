import React from "react";
import TeacherChart from "./TeacherChart";

const TeacherChartCard = () => {
  return (
    <div className="bg-custom_lightblue w-72 h-[370px] py-9 rounded-2xl shadow-xl font-Manrope">
      <div className="flex flex-col gap-6 items-center">
        <div>
          <div className="flex justify-evenly gap-6 items-center">
            <div className=" font-bold flex flex-col gap-6">
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
        </div>

        <button className="border-2 border-primary py-1 px-1 w-36 font-semibold text-primary">
          See More
        </button>
      </div>
    </div>
  );
};

export default TeacherChartCard;
