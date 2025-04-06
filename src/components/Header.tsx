import cicss_logo from "../assets/cicss_logo.png";
import logout_logo from "../assets/logout_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { useEffect, useState, useRef } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { setRole, setDepartment } = useAppContext();
  const [userEmail, setUserEmail] = useState("");
  const [userImage, setUserImage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
    }

    // di nastrore yung image sa local storage pati yung name
    const storedImage = localStorage.getItem("userImage");
    if (storedImage) {
      setUserImage(storedImage);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileButtonRef.current &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("logout");
    setRole("");
    setDepartment("");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("department");
    localStorage.removeItem("email");
    localStorage.removeItem("userImage");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full py-2">
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-center py-2 px-4 lg:px-16">
        <a href="/">
          <img src={cicss_logo} alt="CICSS Logo" className="w-36 lg:w-48" />
        </a>

        {/* User profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="flex items-center">
              {userImage ? (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden mr-2 lg:mr-4">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden mr-2 lg:mr-4 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-600 font-bold">
                    {userEmail && userEmail.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-primary text-xs lg:text-sm font-Manrope font-extrabold truncate max-w-[120px] lg:max-w-full">
                {userEmail}
              </span>
            </div>
            <svg
              className={`w-4 h-4 ml-1 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 font-Helvetica-Neue-Heavy">
              <div className="py-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "block px-4 py-2 text-sm text-primary font-medium bg-gray-100"
                      : "block px-4 py-2 text-sm text-primary hover:bg-gray-100"
                  }
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-left px-4 py-2 text-sm text-primary hover:bg-gray-100"
                >
                  Logout
                  <img src={logout_logo} alt="Logout" className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden justify-between items-center py-2 px-4">
        <a href="/">
          <img src={cicss_logo} alt="CICSS Logo" className="w-24" />
        </a>

        {/* Mobile Menu Button */}
        <button
          ref={mobileButtonRef}
          onClick={toggleMobileMenu}
          className="text-primary focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-14 right-0 w-full bg-white shadow-lg z-10 font-Helvetica-Neue-Heavy"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                {userImage ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
                    <img
                      src={userImage}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full overflow-hidden mr-3 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">
                      {userEmail && userEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-primary text-sm font-Manrope font-extrabold truncate">
                  {userEmail}
                </span>
              </div>
            </div>
            <div className="py-2">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? "block px-4 py-3 text-sm text-primary font-medium bg-gray-100"
                    : "block px-4 py-3 text-sm text-primary hover:bg-gray-100"
                }
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between w-full text-left px-4 py-3 text-sm text-primary hover:bg-gray-100"
              >
                Logout
                <img src={logout_logo} alt="Logout" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mx-auto h-[1px] w-[91.5%] bg-primary"></div>
    </header>
  );
};

export default Header;
