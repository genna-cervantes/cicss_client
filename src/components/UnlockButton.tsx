import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import cs_locked from "../assets/cs_locked.png";

const UnlockButton = () => {
  const { department, setIsLocked } = useAppContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await fetch(
      `http://localhost:3000/schedule/unlock/${department}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.success) {
        console.log("yeyy");
        setIsLocked(false);
        navigate("/departmentchair/view-schedule");
      } else {
        console.log("oh no may error sa pag unlock");
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <button onClick={() => handleClick()} className="">
        <img src={cs_locked} alt="" className="w-full" />
      </button>
    </div>
  );
};

export default UnlockButton;
