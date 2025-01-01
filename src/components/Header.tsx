import React from "react";
import cicss_logo from "../assets/cicss_logo.png";

const Header = () => {
  return (
    <div>
      <header className="flex justify-between items-center px-2 bg-transparent">
        <a href="#">
          <img src={cicss_logo} alt="" className="w-52" />
        </a>
      </header>
    </div>
  );
};

export default Header;
