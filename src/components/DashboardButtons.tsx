import React from "react";
import pencil from "../assets/pencil.png";
import { useNavigate } from "react-router-dom";

interface DashboardButtonsProps {
  Label: string;
  Path: string;
  disabled: boolean
}

const DashboardButtons: React.FC<DashboardButtonsProps> = ({ Label, Path, disabled }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div
        className="flex font-Manrope font-bold 
                   bg-custom_lightblue items-center justify-between 
                   py-4 px-3 md:px-5 rounded-xl shadow-md"
      >
        <div className="truncate mr-2">{Label}</div>
        <button
          disabled={disabled}
          className={`flex flex-shrink-0 border border-primary rounded-md px-3 md:px-6 py-[5px] items-center justify-between gap-2 md:gap-3 ${disabled ? "cursor-not-allowed" : ""}`}
          onClick={() => navigate(Path)}
        >
          <img src={pencil} alt="Edit Icon" className="w-3 md:w-4" />
          <div className="text-primary whitespace-nowrap text-sm">Edit</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardButtons;
