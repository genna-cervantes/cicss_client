import Dashboard from "./pages/Department Chair/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import InputSectionCounts from "./pages/Department Chair/InputSectionCounts";
import InputTAS from "./pages/Department Chair/InputTAS";
import InputRooms from "./pages/Department Chair/InputRooms";
import InputCourseOfferings from "./pages/Department Chair/InputCourseOfferings";
import InputGenEd from "./pages/Department Chair/InputGenEd";
import InputYLD from "./pages/Department Chair/InputYLD";
import InputYLT from "./pages/Department Chair/InputYLT";

const App = () => {
  return (
    <div className="bg-cover bg-no-repeat bg-gradient-to-b from-[#F1FAFF] via-[#BFDDF6] to-[#9FCEF5] min-h-screen scrollbar-hide">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="input-section-counts" element={<InputSectionCounts />} />
        <Route path="input-TAS" element={<InputTAS />} />
        <Route path="input-rooms" element={<InputRooms />} />
        <Route
          path="input-course-offerings"
          element={<InputCourseOfferings />}
        />
        <Route path="input-gened" element={<InputGenEd />} />
        <Route path="input-yld" element={<InputYLD />} />
        <Route path="input-ylt" element={<InputYLT />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
