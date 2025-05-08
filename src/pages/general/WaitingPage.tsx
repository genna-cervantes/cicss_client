import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import cicss_gear_icon from "../../assets/cicss_gear_icon.png";

const WaitingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [scheduleExists, setScheduleExists] = useState<boolean>(
    searchParams.get("exists") === "true"
  );

  const { setIsLocked, setIsReady, semester } = useAppContext();

  const [runningGenerator, setRunningGenerator] = useState(false);
  const [error, setError] = useState<string>();
  const navigate = useNavigate();
  const location = useLocation();

  const [CSSections, setCSSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  } | null>(null);

  const [ITSections, setITSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  } | null>();

  const [ISSections, setISSections] = useState<{
    1: { section: string; specialization: "none" }[];
    2: { section: string; specialization: "none" }[];
    3: { section: string; specialization: "none" }[];
    4: { section: string; specialization: "none" }[];
  } | null>();

  useEffect(() => {
    if (!location.state?.fromButton) {
      navigate("/");
      return;
    }

    console.log("reg", location.state?.regenerate);
    if (scheduleExists && !location.state?.regenerate) {
      navigate("/departmentchair/view-schedule");
    }

    console.log("new sched");

    // generate / regenerate
    const fetchSections = async () => {
      try {
        const department = localStorage.getItem("department") ?? "CS";
        const res = await fetch(`http://localhost:8080/year_sections/CS`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });
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

        const resIT = await fetch("http://localhost:8080/year_sections/IT", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });
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

        const resIS = await fetch("http://localhost:8080/year_sections/IS", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
          },
        });

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
        setError(`error in generating schedule: ${err}`);
        return;
      }
    };

    fetchSections();
  }, [location.state]);

  useEffect(() => {
    if (CSSections && ITSections && ISSections && !runningGenerator) {
      console.log("running gen");

      const generateSchedule = async () => {
        try {
          // if (firstYearSections.length === 0 || secondYearSections.length === 0 || thirdYearSections.length === 0 || fourthYearSections.length === 0){
          //     throw new Error('missing sections')
          // }

          const reqBody = {
            CSSections,
            ITSections,
            ISSections,
            semester: semester === "First Semester" ? 1 : 2,
          };

          console.log("req");
          console.log(reqBody);

          const res = await fetch("http://localhost:3001/generate-schedule", {
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

      console.log("running generate sched");
      setRunningGenerator(true);
      setIsLocked(false);
      setIsReady(false);
      localStorage.setItem("isReady", "false");
      localStorage.setItem("isLocked", "false");

      // pagkadito nagenerate na ulit so change na ulit toh to wala na
      localStorage.setItem("hasChanges", "false");

      generateSchedule();

      console.log("done");

      return () => {
        console.log("Cleanup when the component unmounts");
      };
    }
  }, [CSSections, ITSections, ISSections]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className="flex flex-col items-center justify-center p-8 max-w-md w-full">
        <div className="relative w-60 h-60 mb-6">
          {/* Animated Loading Spinner */}
          <div className="absolute inset-0 border-8 border-blue-400 border-opacity-50 rounded-full"></div>
          <div className="absolute inset-0 border-t-8 border-l-8 border-primary rounded-full animate-spin"></div>

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-52">
              <img src={cicss_gear_icon} alt="" />
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-primary mb-20 text-center">
          Almost there! CICS schedule <br />
          is on the way...
        </h1>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingPage;
