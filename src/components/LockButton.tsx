import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const LockButton = () => {
  const { department } = useAppContext();
  const navigate = useNavigate()

  const handleClick = async () => {
    const res = await fetch(
      `http://localhost:3000/schedule/lock/${department}`
    );

    if (res.ok) {
      const data = await res.json();

      if (data.success) {
        console.log("yeyy");
        navigate("/departmentchair/schedule/locked")
      } else {
        console.log("oh no may error sa pag lock");
      }
    }
  };

  return (
    <button onClick={() => handleClick()} className="">
      Lock Schedule
    </button>
  );
};

export default LockButton;
