import Header from "../../components/Header";
import Greeting from "../../components/Greeting";
import Semester from "../../components/Semester";
import GenerateButton from "../../components/GenerateButton";
import DashboardButtons from "../../components/DashboardButtons";
import DashboardButtonsSC from "../../components/DashboardButtonsSC";

const Dashboard = () => {
  return (
    <div className="bg-cover bg-no-repeat bg-gradient-to-b from-[#F1FAFF] via-[#BFDDF6] to-[#9FCEF5] min-h-screen">
      <Header />
      <section className="flex items-center justify-between py-7 px-12">
        <Greeting userName="Cherry Rose" />
        <Semester />
      </section>
      <section>
        <div className="flex justify-between py-3 px-12">
          <div className="flex flex-col gap-5">
            <DashboardButtons Label="Section Counts" />
            <DashboardButtons Label="Teaching Academic Staff" />
            <DashboardButtons Label="Rooms" />
            <DashboardButtons Label="Course Offerings" />
            <DashboardButtonsSC Label="Gen Ed Constraints" />
            <DashboardButtonsSC Label="Year Level Day Constraints" />
            <DashboardButtonsSC Label="Year Level Time Constraints" />
          </div>
          <GenerateButton />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
