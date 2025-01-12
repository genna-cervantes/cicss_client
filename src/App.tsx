import Dashboard from "./pages/Department Chair/Dashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import SectionCounts from "./pages/Department Chair/SectionCounts";

const App = () => {
  return (
    <div className="bg-cover bg-no-repeat bg-gradient-to-b from-[#F1FAFF] via-[#BFDDF6] to-[#9FCEF5] min-h-screen scrollbar-hide">
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="section-counts" element={<SectionCounts />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
