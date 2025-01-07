import cicss_logo from "../assets/cicss_logo.png";
import logout_logo from "../assets/logout_logo.png";

const Header = () => {
  return (
    <header>
      <div className="flex justify-between items-center py-3 px-16">
        <a href="#">
          <img src={cicss_logo} alt="" className="w-32" />
        </a>
        <nav>
          <ul className="flex gap-8 text-sm font-Akira-Expanded items-center">
            <li className=" text-primary">Dashboard</li>
            <div className=" bg-primary rounded-md w-32">
              <div className="flex px-3 py-1 items-center justify-between">
                <li className="text-white">Logout</li>
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
