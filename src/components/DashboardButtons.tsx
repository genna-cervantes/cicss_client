import React from "react";
import pencil from "../assets/pencil.png";
import { useNavigate } from "react-router-dom";

interface DashboardButtonsProps {
  Label: string;
  Path: string;
}

const DashboardButtons: React.FC<DashboardButtonsProps> = ({ Label, Path }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex font-Manrope font-bold bg-custom_lightblue w-[600px] items-center justify-between py-5 px-5 rounded-xl shadow-lg">
        <div>{Label}</div>
        <button
          className="flex border border-primary rounded-md px-6 py-[5px] items-center justify-between gap-3 hover:shadow-lg"
          onClick={() => navigate(Path)}
        >
          <img src={pencil} alt="Edit Icon" className="w-5" />
          <div className="text-primary">Edit</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardButtons;
