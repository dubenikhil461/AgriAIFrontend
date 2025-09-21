import { useState } from "react";

function SoilPredictor() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please upload an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict-soil", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 relative">
        
        {/* Close Button */}
        <button className="absolute top-4 right-4 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 flex items-center justify-center font-bold">
          ×
        </button>

        <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">🌱 Soil Predictor</h1>

        {/* Upload Area */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label
            htmlFor="fileInput"
            className="border-2 border-dashed border-green-400 rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-green-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12v6m0 0l-3-3m3 3l3-3m-3-6V4m0 0l-3 3m3-3l3 3" />
            </svg>
            <span className="text-green-700 font-medium">{file ? file.name : "Drop your file here or Browse"}</span>
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
          >
            {loading ? "Predicting..." : "Predict Soil"}
          </button>
        </form>

        {/* Prediction Result */}
        {prediction && (
          <div className="mt-6 bg-green-50 p-4 rounded-xl border border-green-200 shadow-inner">
            <h3 className="text-lg font-semibold text-green-700 mb-2 text-center">✅ Prediction</h3>
            <ul className="text-green-800 space-y-1">
              <li><b>Soil Type:</b> {prediction.soil_type}</li>
              <li><b>Confidence:</b> {(prediction.confidence * 100).toFixed(2)}%</li>
              <li><b>N (Nitrogen):</b> {prediction.N}</li>
              <li><b>P (Phosphorus):</b> {prediction.P}</li>
              <li><b>K (Potassium):</b> {prediction.K}</li>
              <li><b>pH:</b> {prediction.pH}</li>
              <li><b>Acidity:</b> {prediction.acidity}</li>
              <li><b>Organic Matter:</b> {prediction.organic_matter}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SoilPredictor;
