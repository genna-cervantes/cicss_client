import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Navigate, Outlet } from "react-router-dom";

const StudentAuth = () => {
  const { role } = useAppContext();

  if (role !== "student") {
    if (role == "department-chair") {
      return <Navigate to="/departmentchair" replace />;
    }
    if (role == "tas") {
      return <Navigate to="/tas" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default StudentAuth;
