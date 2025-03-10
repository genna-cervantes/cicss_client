import React from "react";
import { useNavigate } from "react-router-dom";
import cs_locked from "../../assets/cs_locked.png";
import it_locked from "../../assets/it_locked.png";
import is_locked from "../../assets/is_locked.png";

const ScheduleReadiness = () => {
  const navigate = useNavigate();
  return (
    <div>
      <section className="flex flex-col items-center space-y-10 mt-10">
        <div className="flex space-x-5 items-center text-3xl font-Akira-Expanded">
          <div className="text-[#0350D3]">3/3</div>
          <div className="text-primary">Ready for Manual Editing</div>
        </div>

        <div className="space-y-2">
          <div className="flex mx-24 space-x-3  justify-center">
            <img src={cs_locked} alt="" className="h-1/4 w-2/6" />
            <img src={it_locked} alt="" className="h-2/3 w-2/6" />
            <img src={is_locked} alt="" className="h-2/3 w-2/6" />
          </div>
          <div className="flex mx-24 space-x-80 text-center justify-center font-Helvetica-Neue-Heavy text-2xl text-primary">
            <p>
              Computer
              <br />
              Science
            </p>
            <p>
              Information
              <br />
              Technology
            </p>
            <p>
              Information
              <br />
              Systems
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/departmentchair/schedule-view")}
          className="py-1 px-1 w-36 font-semibold bg-[#0350D3] text-white rounded-sm"
        >
          Continue
        </button>
      </section>
    </div>
  );
};

export default ScheduleReadiness;
