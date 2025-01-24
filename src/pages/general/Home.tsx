import { useGoogleLogin } from "@react-oauth/google";
import {
  checkIfCICSDepartmentChair,
  checkIfCICSStudent,
  checkIfCICSTAS,
  fetchUserInfo,
} from "../../utils/utils";
import { useAppContext } from "../../context/AppContext";
import { redirect, useNavigate } from "react-router-dom";

const Home = () => {
  const { setRole } = useAppContext();
  const navigate = useNavigate();

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
    <div>
      <button onClick={() => login()}>login</button>
    </div>
  );
};

export default Home;
