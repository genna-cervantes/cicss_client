import { NavLink } from "react-router-dom";
 
function GenerateButton() {
  return (
    <div>
      <div>
        <NavLink
          to="schedule-view"
          className="px-56 py-2.5 bg-secondary rounded-md font-Manrope font-bold text-[30px] text-white shadow-md hover:bg-primary"
        >
          Generate Schedule
        </NavLink>
      </div>
    </div>
  );
}

export default GenerateButton;
