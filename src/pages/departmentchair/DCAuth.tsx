import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DCAuth = () => {
  const { role } = useAppContext();

  if (role !== "Department Chair") {
    if (role == "Student") {
      return <Navigate to="/student" replace />;
    }
    if (role == "TAS") {
      return <Navigate to="/tas" replace />;
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

export default DCAuth;
