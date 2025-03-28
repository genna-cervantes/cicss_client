import cicss_logo from "../assets/cicss_logo.png";
import logout_logo from "../assets/logout_logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Header = () => {

  const navigate = useNavigate()
  const { setRole } = useAppContext();

  const handleLogout = () => {
    console.log('logout')
    setRole("")
    localStorage.removeItem('role')
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="pt-4">
      <div className="flex justify-between items-center py-3 px-16">
        <a href="/">
          <img src={cicss_logo} alt="" className="w-36" />
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

            <div className=" bg-primary rounded-md w-32">
              <div className="flex px-3 py-1 items-center justify-between">
                <button onClick={handleLogout} className="text-white">
                  Logout
                </button>
                <img src={logout_logo} alt="" className="w-5 h-4" />
              </div>
            </div>
          </ul>
        </nav>
      </div>
      <div className="mx-auto h-[1px] w-[91.5%] bg-primary"></div>
    </header>
  );
};

export default Header;
