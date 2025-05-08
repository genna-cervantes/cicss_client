import { useAppContext } from "../context/AppContext";

const Semester = () => {
  const {semester} = useAppContext()
  return (
    <div>
      <h1>
        <div className="font-Helvetica-Neue-Heavy px-[16px] py-[9px] bg-custom_yellow rounded-md  text-custom_black">
          {semester === "First Semester" ? "First Term" : "Second Term"} A.Y 2025-2026
        </div>
      </h1>
    </div>
  );
};

export default Semester;
