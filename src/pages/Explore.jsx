import { Link } from "react-router-dom";

import cropImg from "../assets/images/crop.jpg";
import marketImg from "../assets/images/market.jpg";
import tutorialsImg from "../assets/images/tutorial.webp";
import newsImg from "../assets/images/government.webp";
import aiImg from "../assets/images/ai.jpg";
import toolsImg from "../assets/images/tools.jpg";

function Explore() {
  const exploreItems = [
    {
      title: "Crop Recommendations",
      desc: "Discover the best crops to plant based on season, soil type, and region.",
      img: cropImg,
      link: "/crop-recommendation" // ✅ lowercase route
    },
    {
      title: "Market Prices & Trends",
      desc: "Check current and historical crop prices with trend visualizations.",
      img: marketImg
    },
    {
      title: "Tutorials & Guides",
      desc: "Step-by-step guides on planting, harvesting, pest control, and fertilizers.",
      img: tutorialsImg
    },
    {
      title: "Agricultural News",
      desc: "Stay updated with the latest news, schemes, and farming tips.",
      img: newsImg
    },
    {
      title: "AI Insights",
      desc: "Get predictive insights on planting schedules, yield, and disease alerts.",
      img: aiImg
    },
    {
      title: "Farm Tools & Equipment",
      desc: "Explore recommended tools and equipment for efficient farming.",
      img: toolsImg
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 p-10 flex flex-col items-center">
      <h1 className="text-5xl font-bold text-green-900 mb-12 drop-shadow-md">
        Explore
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {exploreItems.map((item, index) => (
          item.link ? (
            <Link 
              key={index} 
              to={item.link} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h2 className="text-2xl font-semibold text-green-800 mb-4">{item.title}</h2>
              <p className="text-gray-700">{item.desc}</p>
            </Link>
          ) : (
            <div 
              key={index} 
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              <img src={item.img} alt={item.title} className="w-full h-48 object-cover rounded-xl mb-4" />
              <h2 className="text-2xl font-semibold text-green-800 mb-4">{item.title}</h2>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

export default Explore;
