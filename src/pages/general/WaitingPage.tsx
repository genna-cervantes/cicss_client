import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WaitingPage = () => {
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!location.state?.fromButton) {
      navigate("/");
      return;
    }

    console.log('gonna generate')
    const generateSchedule = async () => {
        try{
            const res = await fetch("http://localhost:3000/generate-schedule");
            const data = await res.json();
      
            if (res.ok) {
                console.log('wala error')
              if (data){
                  navigate("/departmentchair/schedule-view");
              }
            } else {
              console.log('may error')
              setError("may error sa pag generate sis");
            }
            
        }catch(err: any){
            setError(`may error sa pag generate sis: ${err}`);
        }
    };

    generateSchedule();
  }, [location.state]);

  return (
    <div>
      <h1>Waiting</h1>
      {error ? <h1>{error}</h1> : <></>}
    </div>
  );
};

export default WaitingPage;
