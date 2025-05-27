import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

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
      const res = await fetch("/api/auth/verify-token", {
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

  if (role !== "TAS") {
    if (role == "Student") {
      return <Navigate to="/student" replace />;
    }
    if (role == "Department Chair") {
      return <Navigate to="/departmentchair" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return (
    <div className="bg-cover bg-no-repeat bg-gradient-to-b from-[#F1FAFF] via-[#BFDDF6] to-[#9FCEF5] min-h-screen">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default TASAuth;
