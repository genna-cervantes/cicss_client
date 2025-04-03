import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

const TASAuth = () => {
  const { role, setRole } = useAppContext();

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

        if (!data.role || data.role !== "TAS") {
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

  if (role !== "tas") {
    if (role == "student") {
      return <Navigate to="/student" replace />;
    }
    if (role == "department-chair") {
      return <Navigate to="/departmentchair" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default TASAuth;
