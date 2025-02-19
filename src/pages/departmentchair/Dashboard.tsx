import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import GenerateButton from "../../components/GenerateButton";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";
import StudentChartCard from "../../components/StudentChartCard";
import TeacherChartCard from "../../components/TeacherChartCard";

const Dashboard = () => {
  return (
    <div>
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
          <div className="flex flex-col gap-10 mt-2">
            <GenerateButton />
            <div className="flex justify-between">
              <StudentChartCard />
              <TeacherChartCard />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
