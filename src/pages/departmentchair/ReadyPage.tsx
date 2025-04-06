import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const ReadyPage = () => {
  const [csReady, setCSReady] = useState(false);
  const [isReady, setISReady] = useState(false);
  const [itReady, setITReady] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReadyDepartments = async () => {
      const res = await fetch(
        "http://localhost:3000/schedule/ready/departments"
      );
      if (res.ok) {
        const data = await res.json();

        setCSReady(data.csReady);
        setISReady(data.isReady);
        setITReady(data.itReady);
      }
    };
    fetchReadyDepartments();
  }, []);

  useEffect(() => {
    if (csReady && isReady && itReady) {
      navigate("/departmentchair/manual-edit");
    }
  }, [csReady, isReady, itReady]);

  const handleClick = () => {
    navigate("/departmentchair/manual-edit");
  };

  return (
    <div>
      {csReady && <h1>CS READY</h1>}
      {itReady && <h1>IT READY</h1>}
      {isReady && <h1>IS READY</h1>}
      {csReady && isReady && itReady && (
        <button onClick={handleClick}>Go to manual editing</button>
      )}
    </div>
  );
};

export default ReadyPage;
