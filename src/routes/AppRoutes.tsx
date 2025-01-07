import React from "react";
import { Routes, Route } from "react-router-dom";
import SectionCounts from "../pages/Department Chair/SectionCounts";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="section-counts" element={<SectionCounts />} />
    </Routes>
  );
};

export default AppRoutes;
