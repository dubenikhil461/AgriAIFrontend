import { Link } from "react-router-dom";

// Import images
import weatherImg from "../assets/images/weather.jpg";
import diseaseImg from "../assets/images/plant.jpg";
import voiceImg from "../assets/images/voice.jpg";
import priceImg from "../assets/images/price.jpg";
import cropImg from "../assets/images/crop.jpg";
import fertilizerImg from "../assets/images/fertilizer.jpg";

function Features() {
  const features = [
    {
      title: "Weather Forecast",
      desc: "Get accurate weather predictions for your crops and plan accordingly.",
      img: weatherImg,
      link: "/features/weather",
      btnText: "Learn More"
    },
    {
      title: "Disease Detection",
      desc: "Upload crop images and detect diseases automatically with AI.",
      img: diseaseImg,
      link: "/features/disease-detector",
      btnText: "Try Now"
    },
    {
      title: "Voice Assistant",
      desc: "Interact with the system using voice commands to manage your farm.",
      img: voiceImg,
      link: "/features/voice-assistant",
      btnText: "Try Now"
    },
    {
      title: "Price Predictions",
      desc: "Predict crop market prices based on trends and historical data.",
      img: priceImg,
      link: "/features/liveprices",
      btnText: "Check Prices"
    },
    {
         title: "Crop Recommendations",
         desc: "Discover the best crops to plant based on season, soil type, and region.",
         img: cropImg,
         link: "/features/crop-recommendation", // ✅ lowercase route
         btnText: "Analyze Soil"
       },
    {
      title: "Fertilizer Recommendations",
      desc: "Receive AI-powered fertilizer suggestions to optimize crop health.",
      img: fertilizerImg,
      link: "/features/fertilizer-recommendations",
      btnText: "Get Advice"
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-green-900 mb-12 drop-shadow-md">
        Features
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {features.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between">
            {/* Image */}
            <img src={f.img} alt={f.title} className="w-full h-48 object-cover rounded-xl mb-4" />

            <div>
              <h2 className="text-2xl font-semibold text-green-800 mb-4">{f.title}</h2>
              <p className="text-gray-700">{f.desc}</p>
            </div>

            <Link 
              to={f.link} 
              className="mt-6 inline-block bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition"
            >
              {f.btnText}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
