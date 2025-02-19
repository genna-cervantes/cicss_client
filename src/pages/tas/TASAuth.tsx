import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";

const TASAuth = () => {
  const { role } = useAppContext();

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
