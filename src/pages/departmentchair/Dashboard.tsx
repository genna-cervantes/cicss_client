import { useState, useEffect } from "react";
import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";
import StudentChartCard from "../../components/StudentChartCard";
import TeacherChartCard from "../../components/TeacherChartCard";
import GenerateButton from "../../components/GenerateButton";

const Dashboard = () => {
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);

  //get the role and the department from the local storage
  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);

    const storedDepartment = localStorage.getItem("department");
    setDepartment(storedDepartment);
  }, []);

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
          <div className="lg:col-span-5 flex flex-col gap-5 xl:gap-6">
            <DashboardButtons
              Label="Section Counts"
              Path="input-section-counts"
            />
            <DashboardButtons
              Label="Teaching Academic Staff"
              Path="input-TAS"
            />
            <DashboardButtons Label="Rooms" Path="input-rooms" />
            <DashboardButtons
              Label="Course Offerings"
              Path="input-course-offerings"
            />
            <DashboardButtonsSC Label="Gen Ed Constraints" Path="input-gened" />
            <DashboardButtonsSC
              Label="Year Level Day Constraints"
              Path="input-YLD"
            />
            <DashboardButtonsSC
              Label="Year Level Time Constraints"
              Path="input-YLT"
            />
          </div>

          {/* Right */}
          <div className="lg:col-span-7 flex flex-col gap-5 xl:gap-8">
            <GenerateButton />

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
