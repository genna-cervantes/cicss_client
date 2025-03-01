import { NavLink } from "react-router-dom";

function GenerateButton() {
  return (
    <div className="relative">
      <NavLink
        to="schedule-view"
        className="w-full px-3 py-2 text-center absolute bg-secondary rounded-md font-Manrope font-bold text-[30px] text-white shadow-md hover:bg-primary"
      >
        Generate Schedule
      </NavLink>
    </div>
  );
}

export default GenerateButton;
