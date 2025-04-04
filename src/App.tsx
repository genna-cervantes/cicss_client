import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/general/Home";
import { GoogleOAuthProvider } from "@react-oauth/google";
import StudentDashboard from "./pages/student/StudentDashboard";
import TASDashboard from "./pages/tas/TASDashboard";
import DCAuth from "./pages/departmentchair/DCAuth";
import TASAuth from "./pages/tas/TASAuth";
import StudentAuth from "./pages/student/StudentAuth";
import Dashboard from "./pages/departmentchair/Dashboard";
import InputCourseOfferings from "./pages/departmentchair/InputCourseOfferings";
import InputGenEd from "./pages/departmentchair/InputGenEd";
import InputRooms from "./pages/departmentchair/InputRooms";
import InputSectionCounts from "./pages/departmentchair/InputSectionCounts";
import InputTAS from "./pages/departmentchair/InputTAS";
import InputYLD from "./pages/departmentchair/InputYLD";
import InputYLT from "./pages/departmentchair/InputYLT";
import ManualEdit from "./pages/departmentchair/ManualEdit";
import ViewSchedule from "./pages/departmentchair/ViewSchedule";
import WaitingPage from "./pages/general/WaitingPage";
import Ratings from "./pages/departmentchair/Ratings";
import TermsAndConditions from "./pages/general/TermsAndConditions";
import Help from "./pages/general/Help";
import LockPage from "./pages/departmentchair/LockPage";
import ReadyPage from "./pages/departmentchair/ReadyPage";
import ManualEditViewSchedule from "./components/ManualEditViewSchedule";

const App: React.FC = () => {
  const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID ?? "";

  return (
    <GoogleOAuthProvider clientId={clientId ?? ""}>
      <Router>
        <Routes>
          {/* Protect the sample route */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Home />} />

          <Route path="/departmentchair" element={<DCAuth />}>
            <Route index element={<Dashboard />} />

            {/* add routes for dc here */}
            <Route
              path="input-section-counts"
              element={<InputSectionCounts />}
            />
            <Route path="input-TAS" element={<InputTAS />} />
            <Route path="input-rooms" element={<InputRooms />} />
            <Route
              path="input-course-offerings"
              element={<InputCourseOfferings />}
            />
            <Route path="input-gened" element={<InputGenEd />} />
            <Route path="input-yld" element={<InputYLD />} />
            <Route path="input-ylt" element={<InputYLT />} />

            <Route path="view-schedule" element={<ViewSchedule />} />
            <Route path="manual-edit" element={<ManualEditViewSchedule />} />
            <Route path="lock-schedule" element={<LockPage />} />
            <Route path="ready-schedule" element={<ReadyPage />} />

            <Route path="waiting" element={<WaitingPage />} />

            <Route path="ratings" element={<Ratings />} />

            <Route path="terms-conditions" element={<TermsAndConditions />} />
            <Route path="help" element={<Help />} />


            {/* catch all */}
            <Route
              path="*"
              element={<Navigate to="/departmentchair" replace />}
            />
          </Route>

          <Route path="/tas" element={<TASAuth />}>
            <Route index element={<TASDashboard />} />

            {/* add routes for tas here */}
            <Route path="schedule" element={<div>tas schedule</div>} />

            <Route path="*" element={<Navigate to="/tas" replace />} />
          </Route>

          <Route path="/student" element={<StudentAuth />}>
            <Route index element={<StudentDashboard />} />

            {/* add routes for student here */}
            <Route path="schedule" element={<div>student schedule</div>} />

            <Route path="*" element={<Navigate to="/student" replace />} />
          </Route>
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
