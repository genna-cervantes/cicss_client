import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const LockButton = () => {
  const { department, setIsLocked, isLocked } = useAppContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await fetch(
      `/schedule-api/schedule/lock/${department}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.success) {
        console.log("yeyy");
        setIsLocked(true);
        localStorage.setItem("isLocked", "true");
      } else {
        console.log("oh no may error sa pag lock");
      }
    }
  };

  useEffect(() => {
    if (isLocked) {
      navigate("/departmentchair/lock-schedule");
    }
  }, [isLocked]);

  return (
    <button
      onClick={() => handleClick()}
      className="bg-[#FFBA21] font-Manrope font-extrabold text-gray-700 border border-gray-700 px-4 py-2 rounded-md"
    >
      Lock Schedule
    </button>
  );
};

export default LockButton;
