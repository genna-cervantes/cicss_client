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
                to="help"
                className="hover:text-primary-dark transition-colors"
              >
                Help
              </NavLink>
            </li>
            <li>
              <NavLink
                to="terms-conditions"
                className="hover:text-primary-dark transition-colors"
              >
                Terms and Conditions
              </NavLink>
            </li>
            <li>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSc_az9m6XQ3L0QQX0vo7VB3icgRIFC-dSL3Hebuid4MvFhfiQ/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary-dark transition-colors"
              >
                Send Feedback
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
