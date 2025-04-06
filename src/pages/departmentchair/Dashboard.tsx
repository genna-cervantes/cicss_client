import React, { useEffect, useState } from "react";
import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";
import StudentChartCard from "../../components/StudentChartCard";
import TeacherChartCard from "../../components/TeacherChartCard";
import GenerateButton from "../../components/GenerateButton";
import { useAppContext } from "../../context/AppContext";

const Dashboard = () => {

  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(localStorage.getItem("hasChanges") ?? "");
  const [semester, setSemester] = useState("")
  const {isNewSemester, setPrevSemester, isReady} = useAppContext()

  useEffect(() => {
    setSemester(localStorage.getItem('semester') ?? "")
  }, [])

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const storedDepartment = localStorage.getItem("department");
    setDepartment(storedDepartment);
  }, []);

  const handleChooseSemester = (semester: string) => {
    localStorage.setItem("semester", semester)
    setPrevSemester(semester)
    window.location.reload()
  }

  return (
    <div className="w-full">
      {/* Mobile/Small screen warning */}
      <div className="lg:hidden flex flex-col items-center justify-center h-screen">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Limited Access
          </h2>
          <p className="text-gray-600 mb-6">
            This page is optimized for laptop or desktop use. Please open it
            <br />
            on a larger screen for the best experience.
          </p>
        </div>
      </div>

      <main className="hidden lg:block justify-between max-w-full min-h-screen">
        <section className="flex items-center justify-between py-7 px-2 lg:px-12 xl:px-16 2xl:px-24">
          <Greeting userName={(department ?? "") + (role ? ` ${role}` : "")} />
          <Semester />
        </section>

        <section className="px-2 lg:px-12 xl:px-16 2xl:px-24 grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-8">
          {/* Left*/}
          <div className="lg:col-span-5 flex flex-col gap-3 xl:gap-4">
            <DashboardButtons
              Label="Section Counts"
              Path="input-section-counts"
              disabled={isReady}
              />
            <DashboardButtons
              Label="Teaching Academic Staff"
              Path="input-TAS"
              disabled={isReady}
              />
            <DashboardButtons Label="Rooms" Path="input-rooms" disabled={isReady} />
            <DashboardButtons
              Label="Course Offerings"
              Path="input-course-offerings"
              disabled={isReady}
              />
              
            <DashboardButtonsSC Label="Gen Ed Constraints" Path="input-gened" disabled={isReady} />
            <DashboardButtonsSC
              Label="Year Level Day Constraints"
              Path="input-YLD"
              disabled={isReady}
            />
            <DashboardButtonsSC
              Label="Year Level Time Constraints"
              Path="input-YLT"
              disabled={isReady}
            />
          </div>

          {/* Right */}
          <div className="lg:col-span-7 flex flex-col gap-5 xl:gap-5">
            {/* <NavLink to="schedule-view" className="block w-full">
              <div className="p-2 lg:p-3 xl:p-4 text-center bg-secondary rounded-md font-Manrope font-bold text-2xl md:text-3xl xl:text-4xl text-white shadow-md hover:bg-primary overflow-hidden">
                Generate Schedule
              </div>
            </NavLink> */}
            <GenerateButton className="py-4 text-xl" />
            {semester === "" && 
            <div className="flex items-center justify-between bg-primary/20 px-8 py-2 rounded-lg border-[1px] border-primary/30">
              <h1 className="text-sm">Please confirm the current semester:</h1>
              <div className="flex-2 flex gap-x-2">
                <button onClick={() => handleChooseSemester("First Semester")} className="bg-secondary text-white rounded-md text-xs py-1 px-3 font-semibold">First Semester</button>
                <button onClick={() => handleChooseSemester("First Semester")} className="bg-secondary text-white rounded-md text-xs py-1 px-3 font-semibold">Second Semester</button>
              </div>
            </div>}
            {hasChanges === "true" && 
            <div className="flex items-center justify-between bg-primary/20 px-8 py-2 rounded-lg border-[1px] border-primary/30">
              <h1 className="text-sm">Are there new changes? Generate a new schedule here:</h1>
              <div className="flex-2">
                <GenerateButton hasChanges={true} newSemester={true} className="text-sm px-8 py-2"  />
              </div>
            </div>}
            {isNewSemester && 
            <div className="flex items-center justify-between bg-primary/20 px-8 py-2 rounded-lg border-[1px] border-primary/30">
              <h1 className="text-sm">Is this a new semester? Generate a new schedule here:</h1>
              <div className="flex-2">
                <GenerateButton newSemester={true} className="text-sm px-8 py-2"  />
              </div>
            </div>}


            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 xl:gap-8">
              <div className="w-full">
                <StudentChartCard />
              </div>
              <div className="w-full">
                <TeacherChartCard />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
