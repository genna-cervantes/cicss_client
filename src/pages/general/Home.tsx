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
      console.log(tokenResponse);

      let userInfo = await fetchUserInfo(tokenResponse.access_token);

      // if prof
      if (!checkIfCICSDepartmentChair(userInfo.email)) {
        console.log("not cics");
      } else {
        // redirect to dept chair view
        // write sa local storage
        console.log('department chair')
        setRole("department-chair");
        localStorage.setItem('role', 'department-chair');
        navigate('/departmentchair')
      }

      // if prof
      if (!checkIfCICSTAS(userInfo.email)) {
        console.log("not cics");
      } else {
        // redirect to dept chair view
      }

      // if student
      if (!checkIfCICSStudent(userInfo.email)) {
        console.log("not cics");
      } else {
        // redirect to dept chair view
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
