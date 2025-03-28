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
import CICSSLogo from "../../assets/cicss_logo_login.png";
import HomeBg from "../../assets/home_bg.png";
import GoogleLogo from "../../assets/google_logo.png";
import Footer from "../../components/Footer";

const Home = () => {
  const { role, setRole } = useAppContext();
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

      const res = await fetch("http://localhost:8080/auth/login", {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify({email: userInfo.email})
      })

      const data = await res.json();

      if (res.ok){
        let {token, role} = data;
        setRole(role);
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);

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
      }else{
        console.log('may error sisiy')
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
      className="w-full bg-cover bg-repeat-y bg-center h-screen overflow-hidden"
      style={{ backgroundImage: `url(${HomeBg})` }}
    >
      <div className="flex px-36 py-28 justify-around items-start">
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
