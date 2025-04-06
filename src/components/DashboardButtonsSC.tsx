import React from "react";
import pencil from "../assets/pencil.png";
import { useNavigate } from "react-router-dom";

interface DashboardButtonsSCProps {
  Label: string;
  Path: string;
  disabled: boolean
}

const DashboardButtonsSC: React.FC<DashboardButtonsSCProps> = ({
  Label,
  Path,
  disabled
}) => {
  const navigate = useNavigate();

  console.log(disabled)

  return (
    <div>
<<<<<<< HEAD
      <div className="flex font-Manrope font-bold bg-custom_lightblue items-center justify-between py-7 px-4 rounded-xl shadow-lg hover:shadow-xl">
=======
      <div className={`flex font-Manrope font-bold bg-custom_lightblue items-center justify-between py-4 px-5 rounded-xl shadow-md ${disabled ? "": ""}`}>
>>>>>>> 17618d08f4e015406a648ba9b609fb57360ec430
        <div>{Label}</div>
        <button
          disabled={disabled}
          className={`flex border border-primary rounded-md px-6 py-[5px] items-center justify-between gap-3 ${disabled ? "cursor-not-allowed": ""}`}
          onClick={() => navigate(Path)}
        >
          <img src={pencil} alt="Edit Icon" className="w-3 md:w-4" />
          <div className={`text-primary text-sm`}>Edit</div>
        </button>
      </div>
    </div>
  );
};

export default DashboardButtonsSC;
