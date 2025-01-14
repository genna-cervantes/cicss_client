import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav>
        <ul>
          <div className="flex items-center py-3 px-4 space-x-10 bg-primary  font-Manrope text-white rounded-lg text-[12px] font-semibold">
            <NavLink
              to="/input-section-counts"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Section Counts
            </NavLink>

            <NavLink
              to="/input-TAS"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Teaching Academic Staff
            </NavLink>

            <NavLink
              to="/input-rooms"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Rooms
            </NavLink>

            <NavLink
              to="/input-course-offerings"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Course Offerings
            </NavLink>

            <NavLink
              to="/input-gened"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Gen Ed Constraints
            </NavLink>

            <NavLink
              to="/input-yld"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Year Level-Day Constraints
            </NavLink>

            <NavLink
              to="/input-ylt"
              className={({ isActive }) =>
                isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
              }
            >
              Year Level-Time Constraints
            </NavLink>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
