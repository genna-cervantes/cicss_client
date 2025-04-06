import React, { useEffect, useState } from "react";
import UnlockButton from "../../components/UnlockButton";
import ReadyButton from "../../components/ReadyButton";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const LockPage = () => {
  const { department } = useAppContext();

  const navigate = useNavigate();
  const [csReady, setCSReady] = useState(false);
  const [isReady, setISReady] = useState(false);
  const [itReady, setITReady] = useState(false);

  useEffect(() => {
    const fetchReadyDepartments = async () => {
      const res = await fetch(
        "http://localhost:3000/schedule/ready/departments"
      );
      if (res.ok) {
        const data = await res.json();

        console.log("Ready departments data:", data);

        setCSReady(data.csReady);
        setISReady(data.isReady);
        setITReady(data.itReady);
      }
    };
    fetchReadyDepartments();
  }, []);

  useEffect(() => {
    console.log("Current department:", department);
    console.log("Department ready states:", { csReady, isReady, itReady });

    if (department === "CS" && csReady) {
      console.log("CS department is ready");
      // navigate("/departmentchair/ready-schedule")
      return;
    }

    if (department === "IT" && itReady) {
      console.log("IT department is ready");
      // navigate("/departmentchair/ready-schedule")
      return;
    }
    if (department === "IS" && isReady) {
      console.log("IS department is ready");
      // navigate("/departmentchair/ready-schedule")
      return;
    }
  }, [csReady, isReady, itReady, department]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-16">
      <div className="text-3xl font-extrabold text-primary text-center font-Helvetica-Neue-Heavy">
        {department} SCHEDULE <br /> Successfully Locked
      </div>

      {department === "CS" && !csReady && <UnlockButton />}
      {department === "IT" && !itReady && <UnlockButton />}
      {department === "IS" && !isReady && <UnlockButton />}

      <ReadyButton />
    </div>
  );
};

export default LockPage;
