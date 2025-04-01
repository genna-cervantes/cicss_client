import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    {
      to: "/departmentchair/input-section-counts",
      text: "Section Counts",
    },
    {
      to: "/departmentchair/input-TAS",
      text: "Teaching Academic Staff",
    },
    {
      to: "/departmentchair/input-rooms",
      text: "Rooms",
    },
    {
      to: "/departmentchair/input-course-offerings",
      text: "Course Offerings",
    },
    {
      to: "/departmentchair/input-gened",
      text: "Gen Ed Constraints",
    },
    {
      to: "/departmentchair/input-yld",
      text: "Year Level-Day Constraints",
    },
    {
      to: "/departmentchair/input-ylt",
      text: "Year Level-Time Constraints",
    },
  ];

  return (
    <div className="font-Manrope">
      {/* Mobile navbar with hamburger menu */}
      <div className="lg:hidden bg-primary text-white rounded-lg p-4">
        <div className="flex items-center justify-between gap-96">
          <span className="font-bold font-Manrope"> Constraints Menu</span>
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Hamborger dropdown menu */}
        {isMenuOpen && (
          <div className="mt-2 flex flex-col space-y-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-primary bg-white p-2 rounded-sm text-sm font-bold"
                    : "text-white text-sm font-bold hover:opacity-80 p-2"
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Desktop navbar */}
      <div className="hidden lg:flex items-center justify-between py-3 px-4 bg-primary text-white rounded-lg">
        {navLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              isActive
                ? "text-primary bg-white p-1 rounded-sm text-xs xl:text-sm font-bold mx-1 xl:mx-2 2xl:mx-3 whitespace-nowrap"
                : "text-white text-xs xl:text-sm font-bold mx-1 xl:mx-2 2xl:mx-3 hover:opacity-80 whitespace-nowrap"
            }
          >
            {link.text}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
