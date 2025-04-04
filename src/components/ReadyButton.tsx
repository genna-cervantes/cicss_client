import React, { useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const ReadyButton = () => {
  const { department, setIsReady, isReady } = useAppContext();
  const navigate = useNavigate();

  const handleClick = async () => {
    alert("this cannot be undone, are u sure (gawin tong modal)");

    const res = await fetch(
      `http://localhost:3000/schedule/ready/${department}`
    );

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setIsReady(true);
        localStorage.setItem("isReady", "true")
      } else {
        console.log("error with readying schedule");
      }
      return;
    }
    console.log("error with readying schedule");
  };
  useEffect(() => {
      if (isReady){
        navigate("/departmentchair/ready-schedule");
      } 
  }, [isReady]);

  return <button onClick={handleClick}>Ready</button>;
};

export default ReadyButton;
