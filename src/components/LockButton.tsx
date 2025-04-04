import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const LockButton = () => {
  const { department, setIsLocked, isLocked } = useAppContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    const res = await fetch(
      `http://localhost:3000/schedule/lock/${department}`
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
    if (isLocked){
        navigate("/departmentchair/lock-schedule");
    }
  }, [isLocked]);

  return (
    <button onClick={() => handleClick()} className="">
      Lock Schedule
    </button>
  );
};

export default LockButton;
