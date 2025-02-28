import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center py-[18px] px-[20px] md:px-[100px] mt-4 text-primary font-Manrope">
        {/* Copyright Text */}
        <div className="text-center md:text-left mb-[15px] md:mb-0">
          © Copyright 2024. University of Santo Tomas. All Rights reserved.
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="flex flex-col md:flex-row justify-center md:justify-end gap-4 md:gap-10 font-bold text-sm md:text-base">
            <NavLink to="#" className="hover:text-primary-dark">
              Help
            </NavLink>
            <NavLink to="#" className="hover:text-primary-dark">
              Terms and Conditions
            </NavLink>
            <NavLink to="#" className="hover:text-primary-dark">
              Send Feedback
            </NavLink>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Footer;
