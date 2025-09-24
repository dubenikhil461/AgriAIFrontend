import React, { useState } from 'react';
import { Leaf, Droplets, Thermometer, Wind, Zap, CheckCircle, AlertCircle } from 'lucide-react';
import Ax from '../utils/Axios'

// ✅ Helper function to explain fertilizer in farmer-friendly way
const explainFertilizer = (code) => {
  if (!code) return null;
  const [N, P, K] = code.split('-').map(Number);

  // You can also extend with common names like Urea, DAP, etc.
  let commonName = '';
  if (code === '18-46-0') commonName = ' (DAP - Di Ammonium Phosphate)';
  if (code === '46-0-0') commonName = ' (Urea)';
  if (code === '10-26-26') commonName = ' (NPK Mix Fertilizer)';

  return {
    code,
    commonName,
    details: `This fertilizer contains:
- ${N}% Nitrogen (N): boosts leaf growth & greenness 🌱
- ${P}% Phosphorus (P): helps root development & flowering 🌸
- ${K}% Potassium (K): improves plant strength & disease resistance 💪`
  };
};

const FertilizerRecommendationApp = () => {
  const [formData, setFormData] = useState({
    Nitrogen: '',
    Phosphorous: '',
    Potassium: '',
    Temparature: '',
    Humidity: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.Nitrogen || !formData.Phosphorous || !formData.Potassium || !formData.Temparature || !formData.Humidity) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await Ax.post('/recommend-fertilizer', {
        Nitrogen: parseInt(formData.Nitrogen),
        Phosphorous: parseInt(formData.Phosphorous),
        Potassium: parseInt(formData.Potassium),
        Temparature: parseFloat(formData.Temparature),
        Humidity: parseFloat(formData.Humidity)
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // ✅ Wrap response with explanation
      const fertCode = response.data.recommended_fertilizer;
      setResult(explainFertilizer(fertCode));
    } catch (err) {
      if (err.response) {
        setError(`Server Error: ${err.response.data.detail || 'Failed to get recommendation'}`);
      } else if (err.request) {
        setError('Network Error: Unable to connect to server. Please check your connection.');
      } else {
        setError('Failed to get fertilizer recommendation. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { name: 'Nitrogen', label: 'Nitrogen (N)', type: 'number', icon: <Leaf className="w-5 h-5 text-green-600" />, placeholder: 'Enter nitrogen level', unit: 'ppm' },
    { name: 'Phosphorous', label: 'Phosphorous (P)', type: 'number', icon: <Zap className="w-5 h-5 text-green-600" />, placeholder: 'Enter phosphorous level', unit: 'ppm' },
    { name: 'Potassium', label: 'Potassium (K)', type: 'number', icon: <Droplets className="w-5 h-5 text-green-600" />, placeholder: 'Enter potassium level', unit: 'ppm' },
    { name: 'Temparature', label: 'Temperature', type: 'number', step: '0.1', icon: <Thermometer className="w-5 h-5 text-green-600" />, placeholder: 'Enter temperature', unit: '°C' },
    { name: 'Humidity', label: 'Humidity', type: 'number', step: '0.1', icon: <Wind className="w-5 h-5 text-green-600" />, placeholder: 'Enter humidity level', unit: '%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-green-500">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-green-500 p-3 rounded-full">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                Smart Fertilizer Recommendation
              </h1>
              <p className="text-gray-600 mt-2">Optimize your crop yield with AI-powered fertilizer suggestions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Form Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter Soil & Weather Data</h2>
              <p className="text-gray-600">Provide your current soil nutrients and environmental conditions</p>
            </div>

            <div className="space-y-6">
              {inputFields.map((field) => (
                <div key={field.name} className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{field.label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {field.icon}
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      step={field.step}
                      className="w-full pl-11 pr-16 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 group-hover:border-green-400"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm font-medium">{field.unit}</span>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Leaf className="w-5 h-5" />
                    <span>Get Fertilizer Recommendation</span>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Result Display */}
            {result && (
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-200" />
                  <h3 className="text-2xl font-bold">Recommendation Ready!</h3>
                </div>
                <div className="bg-white/20 rounded-lg p-6 backdrop-blur-sm">
                  <p className="text-lg font-semibold mb-2">Recommended Fertilizer:</p>
                  <p className="text-3xl font-bold text-green-100 mb-2">
                    {result.code}{result.commonName}
                  </p>
                  <p className="text-green-50 whitespace-pre-line">{result.details}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-lg">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Info Cards */}
            <div className="grid gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <Leaf className="w-6 h-6 text-green-500 mr-2" />
                  Why Smart Fertilizers?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Our AI system analyzes your soil composition and environmental conditions to recommend the most suitable fertilizer, helping you achieve optimal crop yield while minimizing waste and environmental impact.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
                <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
                  <Droplets className="w-6 h-6 text-green-500 mr-2" />
                  Key Benefits
                </h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Increased crop productivity</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Reduced fertilizer costs</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Environmental sustainability</li>
                  <li className="flex items-center"><CheckCircle className="w-4 h-4 text-green-500 mr-2" /> Data-driven farming decisions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="w-6 h-6" />
            <span className="text-xl font-bold">Smart Farm Solutions</span>
          </div>
          <p className="text-green-200">Empowering farmers with intelligent agriculture technology</p>
        </div>
      </footer>
    </div>
  );
};

export default FertilizerRecommendationApp;
