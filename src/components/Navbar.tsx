import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <nav>
        <ul>
          <div className="flex space-x-10 bg-primary p-3 font-Manrope text-white rounded-lg text-sm">
            <NavLink to="#">Section Counts</NavLink>

            <NavLink to="#">Teaching Academic Staff</NavLink>

            <NavLink to="#">Rooms</NavLink>

            <NavLink to="#">Course Offerings</NavLink>

            <NavLink to="#">Gen Ed Constraints</NavLink>

            <NavLink to="#">Year Level-Day Constraints</NavLink>

            <NavLink to="#">Year Level-Time Constraints</NavLink>
          </div>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
