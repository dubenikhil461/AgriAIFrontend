import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Weather from "./components/Weather";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import CropRecommendation from "./pages/CropRecommendation";
import LivestockPriceApp from "./pages/LivestockPriceApp";
import DiseaseDetector from "./components/DiseaseDetector";
import VoiceAssistant from "./components/FarmerFriend.jsx";
import FertilizerRecommendationApp from "./components/FertilizerRecommendationApp.jsx";
import "./style/app.css";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Header />
        <div className="p-4">
          <Routes>
            {/* Public Route */}
            <Route path="/" element={<Home />} />

            {/* Protected Routes */}
            <Route path="/features/weather" element={<Weather />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/explore" element={<Explore />} />
            <Route
              path="/features/crop-recommendation"
              element={<CropRecommendation />}
            />
            <Route
              path="/features/liveprices"
              element={<LivestockPriceApp />}
            />
            <Route
              path="/features/disease-detector"
              element={<DiseaseDetector />}
            />
            <Route
              path="/features/voice-assistant"
              element={<VoiceAssistant />}
            />
            <Route
              path="/features/fertilizer-recommendations"
              element={<FertilizerRecommendationApp />}
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
