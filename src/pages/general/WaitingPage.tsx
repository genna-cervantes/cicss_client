import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WaitingPage = () => {
  const [runningGenerator, setRunningGenerator] = useState(false)
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  const [CSSections, setCSSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  }|null>(null);

  const [ITSections, setITSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  }|null>();

  const [ISSections, setISSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  }|null>();

  useEffect(() => {
    if (!location.state?.fromButton) {
      navigate("/");
      return;
    }

    const fetchSections = async () => {
      try {
        const res = await fetch("http://localhost:8080/year_sections/CS");
        const data = await res.json();
        console.log("ung response", data);

        if (res.ok && data) {
          console.log("setting cs sections");
          console.log(data.firstYearSections);
          setCSSections({
            1: data.firstYearSections,
            2: data.secondYearSections,
            3: data.thirdYearSections,
            4: data.fourthYearSections,
          });
        } else {
          console.log("error with fetching data", data);
        }

        const resIT = await fetch("http://localhost:8080/year_sections/IT");
        const dataIT = await resIT.json();
        console.log("ung response", dataIT);

        if (resIT.ok && dataIT) {
          setITSections({
            1: dataIT.firstYearSections,
            2: dataIT.secondYearSections,
            3: dataIT.thirdYearSections,
            4: dataIT.fourthYearSections,
          });
        } else {
          console.log("error with fetching data", dataIT);
        }

        const resIS = await fetch("http://localhost:8080/year_sections/IS");
        const dataIS = await resIS.json();
        console.log("ung response", dataIS);

        if (resIS.ok && dataIS) {
          setISSections({
            1: dataIS.firstYearSections,
            2: dataIS.secondYearSections,
            3: dataIS.thirdYearSections,
            4: dataIS.fourthYearSections,
          });
        } else {
          console.log("error with fetching data", dataIS);
        }
      } catch (err) {
        setError(`may error sa pag fetch ng sections sis: ${err}`);
        return;
      }
    };

    fetchSections();
  }, [location.state]);

  useEffect(() => {
    if (CSSections && ITSections && ISSections && !runningGenerator) {
      const generateSchedule = async () => {
        try {
          // if (firstYearSections.length === 0 || secondYearSections.length === 0 || thirdYearSections.length === 0 || fourthYearSections.length === 0){
          //     throw new Error('missing sections')
          // }

          const reqBody = {
            CSSections,
            ITSections,
            ISSections,
            semester: 2,
          };

          console.log("req");
          console.log(reqBody);

          const res = await fetch("http://localhost:3000/generate-schedule", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(reqBody),
          });

          const data = await res.json();

          if (res.ok) {
            console.log("wala error");
            console.log(data);
            if (data) {
              navigate("/departmentchair/view-schedule");
            }
          } else {
            console.log("may error");
            setError("may error sa pag generate sis");
          }
        } catch (err: any) {
          setError(`may error sa pag generate sis: ${err}`);
          return;
        }
      };

      console.log('running generate sched')
      setRunningGenerator(true);
      generateSchedule();

      console.log("done");
    }

    return () => {
      console.log("Cleanup when the component unmounts");
    };
  }, [CSSections, ITSections, ISSections]);

  return (
    <div>
      <h1>Waiting</h1>
      {error ? <h1>{error}</h1> : <></>}
    </div>
  );
};

export default WaitingPage;
