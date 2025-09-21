import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Weather from "./components/Weather";
import Features from "./pages/Features";
import Contact from "./pages/contact";
import Explore from "./pages/Explore";
import SoilPredictor from "./pages/SoilPredictor";
import CropRecommendation from "./pages/CropRecommendation"; // ✅ Added
import LivestockPriceApp from "./pages/LivestockPriceApp"
import DiseaseDetector from "./components/DiseaseDetector";
import "./style/app.css";

function App() {
  return (
    <div className="App">
      <Header />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Weather" element={<Weather />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/soil" element={<SoilPredictor />} />
          <Route path="/crop-recommendation" element={<CropRecommendation />} />
          <Route path="/features/liveprices" element={<LivestockPriceApp />} /> {/* ✅ Added route */}
          <Route path="/features/disease-detector" element={<DiseaseDetector />} /> {/* ✅ Added route */}
        </Routes>
      </div>
    </div>
  );
}

export default App;