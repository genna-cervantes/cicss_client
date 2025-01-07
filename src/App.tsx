import React, { useState } from "react";
import Dashboard from "./pages/Department Chair/Dashboard";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div>
      <Dashboard />
      <AppRoutes />
    </div>
  );
};

export default App;
