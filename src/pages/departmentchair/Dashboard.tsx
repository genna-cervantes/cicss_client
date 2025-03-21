import React, { useState, useEffect } from "react";
import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";
import StudentChartCard from "../../components/StudentChartCard";
import TeacherChartCard from "../../components/TeacherChartCard";
import { NavLink } from "react-router-dom";

const Dashboard = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Check screen width on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      // Based on your screenshot, we need to detect when width is below a certain threshold
      setIsMinimized(window.innerWidth < 1000); // why check this manually ????
    };

    // Check on initial load
    checkScreenSize();

    // Set up event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div>
      {isMinimized ? (
        // Minimized view
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">
              Limited Access
            </h2>
            <p className="text-gray-600 mb-6">
              This page is optimized for laptop or desktop use. Please open it{" "}
              <br></br>
              on a larger screen for the best experience.
            </p>
          </div>
        </div>
      ) : (
        // Full desktop content
        <main className="w-full">
          <section className="flex items-center justify-between py-7 mx-16">
            <Greeting userName="Cherry Rose" />
            <Semester />
          </section>

          <section className="mx-4 md:mx-8 lg:mx-16 flex md:flex-col-reverse lg:flex-row lg:space-x-5 justify-between">
            {/* Left column - buttons */}
            <div className="w-full lg:w-[40%] flex flex-col gap-5">
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
              <DashboardButtonsSC
                Label="Gen Ed Constraints"
                Path="input-gened"
              />
              <DashboardButtonsSC
                Label="Year Level Day Constraints"
                Path="input-YLD"
              />
              <DashboardButtonsSC
                Label="Year Level Time Constraints"
                Path="input-YLT"
              />
            </div>

            {/* Right column - generate button and charts */}
            <div className="w-full lg:w-[55%] space-y-5 md:mb-5">
              <NavLink to="schedule-view" className="block w-full">
                <div className="p-3 text-center bg-secondary rounded-md font-Manrope font-bold text-2xl md:text-3xl text-white shadow-md hover:bg-primary overflow-hidden ">
                  Generate Schedule
                </div>
              </NavLink>

              <div className="flex flex-col md:flex-row justify-between md:space-x-5">
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
      )}
    </div>
  );
};

export default Dashboard;
