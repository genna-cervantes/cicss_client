import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import Home from "./pages/general/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DCDashboard from "./pages/department_chair/DCDashboard";
import StudentDashboard from "./pages/student/StudentDashboard";
import TASDashboard from "./pages/tas/TASDashboard";
import DCAuth from "./pages/department_chair/DCAuth";
import TASAuth from "./pages/tas/TASAuth";
import StudentAuth from "./pages/student/StudentAuth";

const App: React.FC = () => {

  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={clientId ?? ""}>
      <Router>
        <Routes>
          {/* Protect the sample route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />

          <Route path='/departmentchair' element={<DCAuth />}>
            <Route index element={<DCDashboard />}/>

            {/* add routes for dc here */}
            <Route path=":sectioncount" element={<div>hello</div>} />
          </Route>

          <Route path='/tas' element={<TASAuth />}>
            <Route index element={<TASDashboard />}/>

            {/* add routes for tas here */}
            <Route path=":schedule" element={<div>tas schedule</div>} />
          </Route>

          <Route path='/student' element={<StudentAuth />}>
            <Route index element={<StudentDashboard />}/>

            {/* add routes for student here */}
            <Route path=":schedule" element={<div>student schedule</div>} />
          </Route>

        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
