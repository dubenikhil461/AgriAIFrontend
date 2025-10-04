import { Link } from "react-router-dom";
import { useContext } from "react";
// import Chatbot from "../components/Chatbot";
import { AuthContext } from "../AuthContext"; // adjust path
import farmImage from "../assets/farm.jpg"; // Import your image

function LandingPage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="font-sans min-h-screen relative bg-green-100">
      {/* Hero Section with Farm Image */}
      <section
        className="relative flex flex-col items-center justify-center text-center py-32 px-6 bg-cover bg-center"
        style={{ backgroundImage: `url(${farmImage})` }} // Use imported image
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative z-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg">
            AgriAI
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
            Your smart farming assistant. Detect crop diseases, get AI-powered
            recommendations, and optimize your farm's productivity.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="bg-green-900 text-white py-24 px-6 text-center relative overflow-hidden">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Start Smart Farming Today
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of farmers leveraging AI for better crop yield, disease
          management, and smarter farm decisions.
        </p>
        {!user && (
          <Link
            to="/features"
            className="bg-white text-green-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition transform hover:-translate-y-1 shadow-lg"
          >
            Get Started
          </Link>
        )}
        <div className="absolutfeaturese top-0 left-0 w-full h-full bg-[radial-gradient(circle,_#ffffff_0%,_transparent_70%)] opacity-20 -z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 text-center">
          <div>
            <h3 className="text-5xl font-bold text-green-700 mb-2">1200+</h3>
            <p className="text-gray-700 font-medium">
              Crops Analyzed in Research Phase
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-green-700 mb-2">
              AI-Powered
            </h3>
            <p className="text-gray-700 font-medium">
              Crop & Fertilizer Recommendations
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-green-700 mb-2">50+</h3>
            <p className="text-gray-700 font-medium">
              Plant Diseases Identified in Testing
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-green-700 mb-2">Scalable</h3>
            <p className="text-gray-700 font-medium">
              Designed to Support Millions of Farmers
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 text-center">
        <p>&copy; {new Date().getFullYear()} AgriAI. All rights reserved.</p>
      </footer>

      {/* Chatbot */}
      {/* <Chatbot /> */}
    </div>
  );
}

export default LandingPage;
