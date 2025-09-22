import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Weather from "./components/Weather";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Explore from "./pages/Explore";
import SoilPredictor from "./pages/SoilPredictor";
import CropRecommendation from "./pages/CropRecommendation";
import LivestockPriceApp from "./pages/LivestockPriceApp";
import DiseaseDetector from "./components/DiseaseDetector";
import Login from './pages/Login'
import ProtectedRoute from "./ProtectedRoute"; // ✅ Import
import { AuthProvider } from "./AuthContext";   // ✅ Import
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
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/Weather"
              element={
                <ProtectedRoute>
                  <Weather />
                </ProtectedRoute>
              }
            />
            <Route
              path="/features"
              element={
                <ProtectedRoute>
                  <Features />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              }
            />
            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <Explore />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soil"
              element={
                <ProtectedRoute>
                  <SoilPredictor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-recommendation"
              element={
                <ProtectedRoute>
                  <CropRecommendation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/features/liveprices"
              element={
                <ProtectedRoute>
                  <LivestockPriceApp />
                </ProtectedRoute>
              }
            />
            <Route
              path="/features/disease-detector"
              element={
                <ProtectedRoute>
                  <DiseaseDetector />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;
