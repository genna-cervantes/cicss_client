import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const StudentAuth = () => {
  const { role, setRole } = useAppContext();

  if (role !== "student") {
    if (role == "department-chair") {
      return <Navigate to="/departmentchair" replace />;
    }
    if (role == "tas") {
      return <Navigate to="/tas" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    const email = localStorage.getItem("email") ?? "";

    if (!token || !email) {
      navigate("/");
      setRole("");
      localStorage.setItem("token", "");
      localStorage.setItem("email", "");
      localStorage.setItem("role", "");
    }

    const reqBody = {
      token,
      email,
    };

    const verifyToken = async () => {
      const res = await fetch("http://localhost:8080/auth/verify-token", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(reqBody),
      });

      if (res.ok) {
        const data = await res.json();

        if (!data.role || data.role !== "Student") {
          navigate("/");
          setRole("");
          localStorage.setItem("token", "");
          localStorage.setItem("email", "");
          localStorage.setItem("role", "");
        }
      } else {
        navigate("/");
        setRole("");
        localStorage.setItem("token", "");
        localStorage.setItem("email", "");
        localStorage.setItem("role", "");
      }
    };
    verifyToken();
  }, []);

  return <Outlet />;
};

export default StudentAuth;
