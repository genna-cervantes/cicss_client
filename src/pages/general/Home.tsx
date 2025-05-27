import { useGoogleLogin } from "@react-oauth/google";
import {
  checkIfCICSStudent,
  checkIfCICSTAS,
  fetchUserInfo,
} from "../../utils/utils";
import { useAppContext } from "../../context/AppContext";
import { Navigate, redirect, useNavigate } from "react-router-dom";

import USTLogo from "../../assets/ust_logo.png";
import CICSLogo from "../../assets/cics_logo.png";
import CICSSLogo from "../../assets/cicss_logo_login.png";
import HomeBg from "../../assets/home_bg.png";
import GoogleLogo from "../../assets/google_logo.png";
import Footer from "../../components/Footer";

const Home = () => {
  const { role, setRole, setDepartment } = useAppContext();
  const navigate = useNavigate();

  switch (role) {
    case "Department Chair":
      return <Navigate to="/departmentchair" />;
    case "TAS":
      return <Navigate to="/tas" />;
    case "Student":
      return <Navigate to="/student" />;
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      let userInfo = await fetchUserInfo(tokenResponse.access_token);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ email: userInfo.email }),
      });

      const data = await res.json();

      if (res.ok) {
        let { token, role, email, department } = data;
        setRole(role);
        setDepartment(department);
        localStorage.setItem("department", department);
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);

        switch (role) {
          case "Department Chair":
            navigate("/departmentchair");
            return;
            break;
          case "TAS":
            navigate("/tas");
            return;
            break;
          case "Student":
            navigate("/student");
            return;
            break;
          default:
            navigate("/");
        }
      } else {
        console.log("may error sisiy");
      }

      // // if department chair
      // let isDepartmentChair = await checkIfCICSDepartmentChair(userInfo.email);
      // // console.log(isDepartmentChair);
      // if (isDepartmentChair) {
      //   // redirect to dept chair view
      //   // write sa local storage
      //   setRole("department-chair");
      //   localStorage.setItem("role", "department-chair");
      //   navigate("/departmentchair");
      //   return;
      // }

      // // if prof
      // if (await checkIfCICSTAS(userInfo.email)) {
      //   // redirect to dept chair view
      //   setRole("tas");
      //   localStorage.setItem("role", "tas");
      //   navigate("/tas");
      //   return;
      // }

      // // if student
      // if (checkIfCICSStudent(userInfo.email)) {
      //   // redirect to dept chair view
      //   setRole("student");
      //   localStorage.setItem("role", "student");
      //   navigate("/student");
      //   return;
      // }
    },
  });

  return (
    <div
      className="w-full bg-cover bg-repeat-y bg-center flex flex-col min-h-screen overflow-x-hidden"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="container mx-auto px-4 md:px-8 lg:px-10 xl:px-14 2xl:px-16 py-8 md:py-12 lg:py-16 xl:py-20 max-w-screen-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-center lg:space-x-28 xl:space-x-36 2xl:space-x-48">
            <div className="max-w-xl xl:max-w-2xl">
              <div className="flex mb-6 md:mb-10">
                <img
                  src={USTLogo}
                  alt="UST Logo"
                  className="h-8 md:h-10 lg:h-12 w-auto"
                />
                <img
                  src={CICSLogo}
                  alt="UST CICS Logo"
                  className="h-8 md:h-10 lg:h-12 w-auto"
                />
              </div>
              <h1 className="font-Helvetica-Neue-Heavy text-white text-2xl md:text-3xl lg:text-4xl leading-none">
                Welcome To
              </h1>
              <h1 className="font-CyGrotesk text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl leading-none text-transparent bg-clip-text bg-gradient-text-yellow drop-shadow-lg">
                CICSS
              </h1>
              <p className="font-Manrope text-white text-sm md:text-base lg:text-lg mb-6 md:mb-10">
                Sign in to the <br />
                <span className="font-bold">
                  Centralized Integrated Class Scheduling System
                  <br />
                </span>
                and shape the future of academic scheduling today!
              </p>
              <div>
                <button
                  onClick={() => login()}
                  className="flex bg-gradient-to-b from-[#02296D] to-[#0350D3] items-center justify-center rounded-full pl-2 pr-4 py-2 gap-x-2 hover:shadow-lg transition-shadow"
                >
                  <div>
                    <img
                      src={GoogleLogo}
                      alt="Google Logo"
                      className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12"
                    />
                  </div>
                  <p className="text-white text-sm md:text-base lg:text-lg">
                    Sign in with Google
                  </p>
                </button>
              </div>
            </div>
            <div className="mt-8 lg:mt-0 flex justify-center">
              <img
                src={CICSSLogo}
                alt="CICSS Logo"
                className="w-auto h-64 md:h-80 lg:h-96 xl:h-112 2xl:h-128 max-w-full"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
