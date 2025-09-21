import { useState, useRef, useEffect } from "react";
import { Camera, Upload, Zap, Leaf, AlertTriangle, CheckCircle, Eye, Volume2 } from "lucide-react";

// Mock Axios for demo - replace with your actual Axios import
const Ax = {
  post: async (url, formData, config) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    const diseases = [
      { label: "Healthy Crop", confidence: 0.95 },
      { label: "Bacterial Blight", confidence: 0.87 },
      { label: "Leaf Spot", confidence: 0.92 },
      { label: "Powdery Mildew", confidence: 0.89 },
      { label: "Rust Disease", confidence: 0.84 }
    ];
    return { data: diseases[Math.floor(Math.random() * diseases.length)] };
  }
};

function DiseaseDetector() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  // Simulate upload progress
  useEffect(() => {
    if (loading) {
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(interval);
            return 95;
          }
          return prev + Math.random() * 15;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
    setResult(null);
    setError("");
    setShowDetails(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileChange(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await Ax.post("/predict/model1", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploadProgress(100);
      const prediction = response.data;
      setResult(prediction);
      
      setTimeout(() => setShowDetails(true), 500);

      // Text-to-Speech
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(
          `Analysis complete. Detected ${prediction.label} with ${(prediction.confidence * 100).toFixed(1)} percent confidence`
        );
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again with a different image.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const getResultColor = (confidence) => {
    if (confidence >= 0.9) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (confidence >= 0.7) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getResultIcon = (confidence) => {
    if (confidence >= 0.9) return <CheckCircle className="w-6 h-6 text-emerald-500" />;
    if (confidence >= 0.7) return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    return <AlertTriangle className="w-6 h-6 text-red-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 p-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
              AI Crop Guardian
            </h1>
          </div>
          <p className="text-xl text-emerald-100/80 max-w-2xl mx-auto leading-relaxed">
            Advanced machine learning technology for instant crop disease detection and analysis
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Camera className="w-6 h-6 text-emerald-400" />
              Image Upload
            </h2>

            {/* Drag and Drop Area */}
            <div
              className={`border-3 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive 
                  ? "border-emerald-400 bg-emerald-400/10 scale-105" 
                  : "border-white/30 hover:border-emerald-400/50 hover:bg-white/5"
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {preview ? (
                <div className="space-y-4">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-64 h-64 object-cover rounded-xl mx-auto shadow-lg ring-4 ring-emerald-400/20"
                  />
                  <p className="text-emerald-300 font-medium">Click to change image</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-white text-lg font-semibold mb-2">
                      Drop your crop image here
                    </p>
                    <p className="text-white/60">
                      or click to browse files
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className={`w-full mt-6 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                !file || loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Analyzing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Zap className="w-5 h-5" />
                  Analyze Crop Health
                </div>
              )}
            </button>

            {/* Progress Bar */}
            {loading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-white/70 mb-2">
                  <span>Processing image...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-emerald-400" />
              Analysis Results
            </h2>

            {!result && !error && !loading && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-10 h-10 text-white/40" />
                </div>
                <p className="text-white/60 text-lg">
                  Upload an image to begin analysis
                </p>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-emerald-500/30 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <Zap className="absolute inset-0 w-8 h-8 text-emerald-400 m-auto" />
                </div>
                <p className="text-emerald-300 text-lg font-medium">
                  AI is analyzing your crop...
                </p>
              </div>
            )}

            {result && (
              <div className={`space-y-6 ${showDetails ? 'animate-in fade-in duration-500' : 'opacity-0'}`}>
                <div className={`p-6 rounded-2xl border-2 ${getResultColor(result.confidence)}`}>
                  <div className="flex items-center gap-4 mb-4">
                    {getResultIcon(result.confidence)}
                    <div>
                      <h3 className="text-xl font-bold">
                        {result.label}
                      </h3>
                      <p className="text-sm opacity-75">
                        Confidence: {(result.confidence * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  
                  {/* Confidence Bar */}
                  <div className="w-full bg-black/10 rounded-full h-3 mb-4">
                    <div
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        result.confidence >= 0.9 ? 'bg-emerald-500' :
                        result.confidence >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Audio Feedback Button */}
                <button
                  onClick={() => {
                    if ("speechSynthesis" in window) {
                      const utterance = new SpeechSynthesisUtterance(
                        `The analysis shows ${result.label} with ${(result.confidence * 100).toFixed(1)} percent confidence`
                      );
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-white"
                >
                  <Volume2 className="w-4 h-4" />
                  Play Audio Result
                </button>

                {/* Recommendations */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h4 className="text-white font-semibold mb-2">Recommendations:</h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {result.label === "Healthy Crop" 
                      ? "Your crop appears healthy! Continue with regular monitoring and maintenance practices."
                      : "Consider consulting with an agricultural specialist for treatment options. Early intervention can prevent spread and minimize crop loss."
                    }
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6 text-center">
                <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-300 font-medium">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: "Instant Analysis", desc: "Get results in seconds with our advanced AI models" },
            { icon: Eye, title: "High Accuracy", desc: "95%+ accuracy rate with continuous learning capabilities" },
            { icon: Volume2, title: "Audio Feedback", desc: "Accessible results with text-to-speech technology" }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <feature.icon className="w-8 h-8 text-emerald-400 mb-3" />
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/70 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetector;