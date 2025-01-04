import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard_dc from "../pages/Dashboard_dc";
import Student_hp from "../pages/Student_hp";
import Tas_hp from "../pages/Tas_hp";

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/Dashboard_dc" element={<Dashboard_dc />} />
        <Route path="/Student-homepage" element={<Student_hp />} />
        <Route path="/TAS-homepage" element={<Tas_hp />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
