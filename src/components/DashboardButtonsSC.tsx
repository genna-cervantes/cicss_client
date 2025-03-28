import React from "react";
import pencil from "../assets/pencil.png";
import { useNavigate } from "react-router-dom";

interface DashboardButtonsSCProps {
  Label: string;
  Path: string;
}

const DashboardButtonsSC: React.FC<DashboardButtonsSCProps> = ({
  Label,
  Path,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex font-Manrope font-bold bg-custom_lightblue items-center justify-between py-5 px-5 rounded-xl shadow-lg hover:shadow-xl">
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

export default DashboardButtonsSC;
