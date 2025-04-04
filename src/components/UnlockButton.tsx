import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

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
    <button onClick={() => handleClick()} className="">
      Unock Schedule
    </button>
  );
};

export default UnlockButton;
