import cicss_logo_header from "../assets/cicss_logo_header.png";
import logout_logo from "../assets/logout_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const { setRole } = useAppContext();

  const handleLogout = () => {
    // Clear the role from context
    setRole("");

    // Remove role from localStorage
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/");
  };

  return (
    <header>
      <div className="flex justify-between items-center py-3 px-16">
        <a href="/">
          <img src={cicss_logo_header} alt="" className="w-32" />
        </a>
        <nav>
          <ul className="flex gap-8 text-sm font-Akira-Expanded items-center">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary underline decoration-2"
                  : "text-primary hover:text-secondary"
              }
            >
              Dashboard
            </NavLink>

            <div className="bg-primary rounded-md w-32">
              <button
                onClick={handleLogout}
                className="flex w-full px-3 py-1 items-center justify-between"
              >
                <span className="text-white">Logout</span>
                <img src={logout_logo} alt="" className="w-5 h-4" />
              </button>
            </div>
          </ul>
        </nav>
      </div>
      <div className="mx-auto h-[1px] w-[91.5%] bg-primary"></div>
    </header>
  );
};

export default Header;
