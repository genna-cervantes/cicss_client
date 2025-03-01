import React from "react";
import cs_locked from "../../assets/cs_locked.png";
import { useNavigate } from "react-router-dom";

const SchedulePublishing = () => {
  const navigate = useNavigate();

  return (
    <div>
      <section className="flex flex-col items-center space-y-14 mt-10 mb-14">
        <div className="flex flex-col items-center text-3xl font-Akira-Expanded">
          <div className="text-[#0350D3]">CS Schedule</div>
          <div className="text-primary">Successfully Locked</div>
        </div>

        <img src={cs_locked} alt="" className="h-2/3 w-2/6" />

        <button
          onClick={() => navigate("/departmentchair/schedule-readiness")}
          className="py-1 px-1 w-36 font-semibold bg-[#0350D3] text-white  rounded-sm"
        >
          Ready
        </button>
      </section>
    </div>
  );
};

export default SchedulePublishing;
