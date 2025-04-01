import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto w-full">
      <div className="w-full flex flex-col md:flex-row justify-between items-center py-4 px-6 md:px-12 lg:px-24 text-primary font-Manrope">
        <div className="text-center md:text-left mb-4 md:mb-0 text-sm md:text-base">
          © Copyright 2024. University of Santo Tomas. All Rights reserved.
        </div>

        {/* Navigation Links */}
        <nav className="w-full md:w-auto">
          <ul className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 font-bold text-sm">
            <li>
              <NavLink
                to="#"
                className="hover:text-primary-dark transition-colors"
              >
                Help
              </NavLink>
            </li>
            <li>
              <NavLink
                to="#"
                className="hover:text-primary-dark transition-colors"
              >
                Terms and Conditions
              </NavLink>
            </li>
            <li>
              <NavLink
                to="#"
                className="hover:text-primary-dark transition-colors"
              >
                Send Feedback
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
