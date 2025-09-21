import React, { useState } from "react";
import Ax from '../utils/Axios'
const CropRecommendation = () => {
  const [inputs, setInputs] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [recommendedCrop, setRecommendedCrop] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setRecommendedCrop("");

    try {
      const response = await Ax.post(
        "/recommend-crop",
        inputs,
        { headers: { "Content-Type": "application/json" } }
      );

      setRecommendedCrop(response.data.recommended_crop);
    } catch (err) {
      console.error(err);
      setError("Failed to get recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputLimits = {
    N: { min: 0, max: 140, label: "Nitrogen (N)" },
    P: { min: 5, max: 145, label: "Phosphorus (P)" },
    K: { min: 5, max: 205, label: "Potassium (K)" },
    temperature: { min: 0, max: 50, label: "Temperature (°C)" },
    humidity: { min: 0, max: 100, label: "Humidity (%)" },
    ph: { label: "Soil pH" }, // No min/max for pH
    rainfall: { min: 0, max: 500, label: "Rainfall (mm)" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-4xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-bold text-green-900 text-center mb-8 drop-shadow-md">
          🌱 Crop Recommendation
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.keys(inputs).map((key) => (
            <div key={key} className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">{inputLimits[key].label}:</label>
              <input
                type="number"
                name={key}
                value={inputs[key]}
                onChange={handleChange}
                required
                {...(inputLimits[key].min !== undefined ? { min: inputLimits[key].min } : {})}
                {...(inputLimits[key].max !== undefined ? { max: inputLimits[key].max } : {})}
                placeholder={
                  inputLimits[key].min !== undefined && inputLimits[key].max !== undefined
                    ? `${inputLimits[key].min} - ${inputLimits[key].max}`
                    : ""
                }
                className="px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-300 hover:border-green-400"
              />
            </div>
          ))}

          <div className="col-span-full">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-2xl font-semibold hover:from-green-500 hover:to-green-600 shadow-lg transition duration-300"
            >
              {loading ? "Predicting..." : "Get Recommendation"}
            </button>
          </div>
        </form>

        {recommendedCrop && (
          <div className="mt-8 p-6 bg-green-100 rounded-2xl text-center shadow-inner animate-fadeIn">
            <h3 className="text-xl font-bold text-green-800 mb-2">Recommended Crop:</h3>
            <p className="text-3xl font-extrabold text-green-900 animate-pulse">
              {recommendedCrop.toUpperCase()}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-100 rounded-2xl text-center shadow-inner">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropRecommendation;
