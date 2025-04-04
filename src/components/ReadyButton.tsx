import React from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ReadyButton = () => {
  const { department } = useAppContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    alert("this cannot be undone, are u sure (gawin tong modal)");

    const res = await fetch(
      `http://localhost:3000/schedule/ready/${department}`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        navigate("/departmentchair/ready-schedule");
      } else {
        console.log("error with readying schedule");
      }
      return;
    }
    console.log("error with readying schedule");
  };

  return <button onClick={handleClick}>Ready</button>;
};

export default ReadyButton;
