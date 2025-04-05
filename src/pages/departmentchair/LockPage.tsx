import React, { useEffect, useState } from "react";
import UnlockButton from "../../components/UnlockButton";
import ReadyButton from "../../components/ReadyButton";
import { useAppContext } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const LockPage = () => {

    const {department} = useAppContext()

    const navigate = useNavigate()
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

        console.log(data)

        setCSReady(data.csReady);
        setISReady(data.isReady);
        setITReady(data.itReady);
      }
    };
    fetchReadyDepartments();

  }, []);

  useEffect(() => {
    console.log(department)
    if (department === 'CS' && csReady){
        console.log(department)
        console.log(csReady)
        // navigate("/departmentchair/ready-schedule")
        return;
    }
    if (department === 'IT' && itReady){
        console.log('hitting')
        // navigate("/departmentchair/ready-schedule")
        return;
    }
    if (department === 'IS' && isReady){
        console.log('hitting 2')
        // navigate("/departmentchair/ready-schedule")
        return;
    }
  }, [csReady, isReady, itReady])

  return (
    <div>
      LockPage
      {department === 'CS' && !csReady && <UnlockButton />}
      {department === 'IT' && !isReady && <UnlockButton />}
      {department === 'IS' && !isReady && <UnlockButton />}
      <ReadyButton />
    </div>
  );
};

export default LockPage;
