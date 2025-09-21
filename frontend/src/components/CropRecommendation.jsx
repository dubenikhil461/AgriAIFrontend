function CropRecommendation() {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-green-800 font-medium">Enter Soil & Weather Info:</label>
      <input
        type="text"
        placeholder="e.g., soil type, rainfall"
        className="block w-full text-gray-700 bg-white border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-500"
      />
      <button className="bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:bg-green-800 hover:shadow-lg transition-all duration-200 mt-2">
        Get Crop Recommendation
      </button>
    </div>
  );
}

export default CropRecommendation;
