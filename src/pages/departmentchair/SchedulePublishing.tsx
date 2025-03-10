import React, { useState } from "react";
import cs_locked from "../../assets/cs_locked.png";
import cs_unlocked from "../../assets/cs_unlocked.png";
import { useNavigate } from "react-router-dom";

const SchedulePublishing = () => {
  const navigate = useNavigate();
  const [isLocked, setIsLocked] = useState(true);

  const handleScheduleClick = () => {
    setIsLocked(false);

    // Navigate to ViewSchedule page after 3 seconds
    setTimeout(() => {
      navigate("/departmentchair/schedule-view");
    }, 1500);
  };

  return (
    <div>
      <section className="flex flex-col items-center space-y-5 mt-10 mb-10">
        <div className="flex flex-col items-center text-3xl font-Akira-Expanded">
          <div className="text-[#0350D3]">CS Schedule</div>
          <div className="text-primary">
            {isLocked ? "Successfully Locked" : "Unlocked"}
          </div>
        </div>

        <div className="flex justify-center w-full">
          <button
            onClick={handleScheduleClick}
            className="bg-transparent border-0 p-0 cursor-pointer flex justify-center"
          >
            <img
              src={isLocked ? cs_locked : cs_unlocked}
              alt={isLocked ? "Locked Schedule" : "Unlocked Schedule"}
              className="h-2/3 w-2/6"
            />
          </button>
        </div>

        <button
          onClick={() => navigate("/departmentchair/schedule-readiness")}
          className="py-1 px-1 w-36 font-semibold bg-[#0350D3] text-white rounded-sm"
        >
          Ready
        </button>
      </section>
    </div>
  );
};

export default SchedulePublishing;
