import { useGoogleLogin } from "@react-oauth/google";
import {
  checkIfCICSDepartmentChair,
  checkIfCICSStudent,
  checkIfCICSTAS,
  fetchUserInfo,
} from "../../utils/utils";
import { useAppContext } from "../../context/AppContext";
import { Navigate, redirect, useNavigate } from "react-router-dom";

import USTLogo from "../../assets/ust_logo.png";
import CICSLogo from "../../assets/cics_logo.png";
import CICSSLogo from "../../assets/cicss_logo.png";
import HomeBg from "../../assets/home_bg.png";
import GoogleLogo from "../../assets/google_logo.png";
import Footer from "../../components/Footer";

const Home = () => {
  const { role, setRole } = useAppContext();
  const navigate = useNavigate();

  switch (role) {
    case "department-chair":
      return <Navigate to="/departmentchair" />;
    case "tas":
      return <Navigate to="/tas" />;
    case "student":
      return <Navigate to="/student" />;
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let userInfo = await fetchUserInfo(tokenResponse.access_token);

      // if department chair
      if (await checkIfCICSDepartmentChair(userInfo.email)) {
        // redirect to dept chair view
        // write sa local storage
        setRole("department-chair");
        localStorage.setItem("role", "department-chair");
        navigate("/departmentchair");
      }

      // if prof
      if (await checkIfCICSTAS(userInfo.email)) {
        // redirect to dept chair view
        setRole("tas");
        localStorage.setItem("role", "tas");
        navigate("/tas");
      }

      // if student
      if (checkIfCICSStudent(userInfo.email)) {
        // redirect to dept chair view
        setRole("student");
        localStorage.setItem("role", "student");
        navigate("/student");
      }
    },
  });

  return (
    <div
      className="w-full bg-cover bg-repeat-y bg-center h-screen overflow-hidden"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="flex px-36 py-28 justify-around items-start flex-wrap">
        <div>
          <div className="flex mb-10">
            <img src={USTLogo} alt="UST Logo" className="w-auto h-10" />
            <img src={CICSLogo} alt="UST CICS Logo" className="w-auto h-10" />
          </div>
          <h1 className="font-Helvetica-Neue-Heavy text-white text-3xl leading-none">
            Welcome To
          </h1>
          <h1 className="font-CyGrotesk text-[100px] leading-none text-transparent bg-clip-text bg-gradient-text-yellow drop-shadow-lg">
            CICSS
          </h1>
          <p className="font-Manrope text-white mb-10">
            Sign in to the <br />
            <span className="font-bold">
              Centralized Integrated Class Scheduling System
              <br />
            </span>
            and shape the future of academic scheduling today!
          </p>
          <button
            onClick={() => login()}
            className="flex bg-gradient-to-b from-[#02296D] to-[#0350D3] items-center justify-center rounded-[100px] pl-2 pr-4 py-2 gap-x-2"
          >
            <div>
              <img src={GoogleLogo} alt="Google Logo" className="h-10 w-10" />
            </div>
            <p className="text-white">Sign in with Google</p>
          </button>
        </div>
        <div>
          <img src={CICSSLogo} alt="CICSS Logo" className="w-auto h-[480px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
