import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="flex items-center py-3 px-4 space-x-10 bg-primary  font-Manrope text-white rounded-lg text-[12px] font-semibold md:whitespace-nowrap">
        <NavLink
          to="/departmentchair/input-section-counts"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Section Counts
        </NavLink>

        <NavLink
          to="/departmentchair/input-TAS"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Teaching Academic Staff
        </NavLink>

        <NavLink
          to="/departmentchair/input-rooms"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Rooms
        </NavLink>

        <NavLink
          to="/departmentchair/input-course-offerings"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Course Offerings
        </NavLink>

        <NavLink
          to="/departmentchair/input-gened"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Gen Ed Constraints
        </NavLink>

        <NavLink
          to="/departmentchair/input-yld"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Year Level-Day Constraints
        </NavLink>

        <NavLink
          to="/departmentchair/input-ylt"
          className={({ isActive }) =>
            isActive ? "text-primary bg-white p-1 rounded-sm" : "text-white"
          }
        >
          Year Level-Time Constraints
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
