import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/general/Home";
import Sample from "./pages/department_chair/Sample";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAppContext } from "./context/AppContext";

const App: React.FC = () => {
  const { role } = useAppContext();

  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID ?? "";

  // Higher-Order Component for Authorization
  const withAuth = <P extends object>(
    Component: React.ComponentType<P>,
    role: string | null,
    redirectTo: string = "/"
  ): React.FC<P> => {
    return (props: P) => {
      // Role check
      if (role !== "department-chair") {
        return <Navigate to={redirectTo} replace />;
      }

      return <Component {...props} />;
    };
  };

  // Wrap the `Sample` component with `withAuth`
  const ProtectedSample = withAuth(Sample, role);

  return (
    <GoogleOAuthProvider clientId={clientId ?? ""}>
      <Router>
        <Routes>
          {/* Protect the sample route */}
          <Route path="/" element={<Home />} />
          <Route path="/departmentchair" element={<ProtectedSample />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
