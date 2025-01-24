import React from "react";
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex justify-between items-center px-16 pb-5 text-primary font-Manrope">
        <div>
          © Copyright 2024. University of Santo Tomas. All Rights reserved.
        </div>
        <nav>
          <ul className="flex gap-10 font-bold underline decoration-primary">
            <NavLink to="#">Help</NavLink>
            <NavLink to="#">Terms and Conditions</NavLink>
            <NavLink to="#">Send Feedback</NavLink>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Footer;