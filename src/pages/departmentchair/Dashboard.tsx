import React, { useState, useEffect } from "react";
import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import GenerateButton from "../../components/GenerateButton";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";
import StudentChartCard from "../../components/StudentChartCard";
import TeacherChartCard from "../../components/TeacherChartCard";

const Dashboard = () => {
  const [isMinimized, setIsMinimized] = useState(false);

  // Check screen width on mount and when window resizes
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMinimized(window.innerWidth < 1500);
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
        <main>
          <section className="flex items-center justify-between py-7 px-16">
            <Greeting userName="Cherry Rose" />
            <Semester />
          </section>
          <section>
            <div className="flex justify-between py-3 px-16">
              <div className="flex flex-col gap-5">
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
              <div className="flex flex-col gap-10 mt-2">
                <GenerateButton />
                <div className="flex justify-between">
                  <StudentChartCard />
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
