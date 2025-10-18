import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  Sun,
  TrendingUp,
  Calendar,
  MapPin,
  Globe,
  AlertTriangle,
  Bell
} from "lucide-react";

// ✅ Toast/Alert Component for Mobile style alerts
function MobileAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 animate-bounce">
      <Bell className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 font-bold">×</button>
    </div>
  );
}

function FarmerFriend() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [showMaintenance, setShowMaintenance] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // ✅ for mobile alerts
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // ✅ Multilingual support (English, Hindi, Marathi)
  const languages = {
    "en-US": { name: "English", voice: "en-US", flag: "🇺🇸" },
    "hi-IN": { name: "हिंदी", voice: "hi-IN", flag: "🇮🇳" },
    "mr-IN": { name: "मराठी", voice: "mr-IN", flag: "🇮🇳" },
  };

  // ✅ Multilingual query responses
  const queryDatabase = {
    "weather": {
      responses: {
        "en-US": "Today's weather in Panvel is sunny with scattered clouds. 🌤️",
        "hi-IN": "आज पनवेल का मौसम धूप और हल्के बादलों वाला है। 🌤️",
        "mr-IN": "आज पनवेलचे हवामान उन्हाळे आणि थोडे ढगाळ आहे. 🌤️",
      },
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      category: "Weather",
    },
    "crop tips": {
      responses: {
        "en-US": "Ensure irrigation and use organic compost for better yield.",
        "hi-IN": "सिंचाई करें और बेहतर पैदावार के लिए जैविक खाद का उपयोग करें।",
        "mr-IN": "सिंचन करा आणि चांगल्या उत्पादनासाठी सेंद्रिय खत वापरा.",
      },
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      category: "Farming Tips",
    },
    "soil tips": {
      responses: {
        "en-US": "Check soil pH regularly. Panvel soil is slightly acidic.",
        "hi-IN": "मिट्टी का pH नियमित रूप से जांचें। पनवेल की मिट्टी थोड़ी अम्लीय है।",
        "mr-IN": "मातीचा pH नियमित तपासा. पनवेलची माती थोडी आम्लीय आहे.",
      },
      icon: <Globe className="w-5 h-5 text-yellow-600" />,
      category: "Soil",
    },
    "help": {
      responses: {
        "en-US": "I am FarmerFriend! Ask about weather, soil, pests, irrigation, market trends.",
        "hi-IN": "मैं FarmerFriend हूँ! मौसम, मिट्टी, कीट, सिंचाई और बाजार के बारे में पूछें।",
        "mr-IN": "मी FarmerFriend आहे! हवामान, माती, कीड, सिंचन आणि बाजाराबद्दल विचारा.",
      },
      icon: <Sparkles className="w-5 h-5 text-green-600" />,
      category: "Assistant",
    },
  };

  // ✅ Speech recognition setup
  const initializeSpeechRecognition = () => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setAlertMessage("Speech recognition not supported on this browser 🚫");
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();

    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = selectedLanguage;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setAnimationKey((prev) => prev + 1);
    };

    recognitionRef.current.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;
      const confidence = result[0].confidence;

      setText(transcript);
      setConfidence(Math.round(confidence * 100));

      if (result.isFinal) {
        handleQuery(transcript);
      }
    };

    recognitionRef.current.onerror = (event) => {
      setAlertMessage("⚠️ Error: " + event.error);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    return true;
  };

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    if (!recognitionRef.current && !initializeSpeechRecognition()) {
      return;
    }
    setText("");
    setResponse("");
    recognitionRef.current.start();
  };

  // ✅ Query handling
  const handleQuery = (query) => {
    let matchedResponse = null;

    for (const [key, data] of Object.entries(queryDatabase)) {
      if (query.toLowerCase().includes(key)) {
        matchedResponse = data;
        break;
      }
    }

    const defaultResponse = {
      "en-US": "Sorry, I didn't understand. Try asking about weather or farming tips.",
      "hi-IN": "माफ़ कीजिए, मुझे समझ नहीं आया। मौसम या खेती के बारे में पूछें।",
      "mr-IN": "क्षमस्व, मला समजले नाही. हवामान किंवा शेतीबद्दल विचारा.",
    };

    const finalResponse = matchedResponse
      ? matchedResponse.responses[selectedLanguage]
      : defaultResponse[selectedLanguage];

    setResponse(finalResponse);
    setAlertMessage("✅ Answer Ready!");

    const newEntry = {
      id: Date.now(),
      query,
      response: finalResponse,
      timestamp: new Date().toLocaleTimeString(),
      icon: matchedResponse?.icon,
      category: matchedResponse?.category || "General",
      confidence,
      language: languages[selectedLanguage].name,
    };

    setConversation((prev) => [newEntry, ...prev.slice(0, 4)]);
    speakResponse(finalResponse);
  };

  const speakResponse = (text) => {
    if (synthRef.current) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    if (recognitionRef.current) recognitionRef.current.lang = langCode;
    setAlertMessage(`🌐 Language changed to ${languages[langCode].name}`);
  };

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 text-gray-800">
      {/* ✅ Mobile Alert */}
      <MobileAlert message={alertMessage} onClose={() => setAlertMessage("")} />

      {/* Header */}
      <div className="text-center mb-6 pt-8">
        <h1 className="text-3xl font-bold text-green-700">🌾 FarmerFriend 🌱</h1>
        <p className="text-gray-600 text-sm">Your Multilingual Agricultural Voice Assistant</p>

        {/* Language Selector */}
        <div className="flex justify-center gap-2 mt-4">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedLanguage === code
                  ? "bg-green-600 text-white"
                  : "bg-white border border-green-300 text-green-600"
              }`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
      </div>

      {/* Voice control */}
      <div className="flex justify-center my-6">
        <button
          onClick={handleVoiceInput}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${
            isListening ? "bg-red-500 animate-pulse" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isListening ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
        </button>
      </div>

      {/* Query & Response */}
      <div className="max-w-xl mx-auto p-4">
        {text && <p className="mb-2"><b>You:</b> {text}</p>}
        {response && <p className="bg-green-100 p-3 rounded-lg"><b>FF:</b> {response}</p>}
      </div>
    </div>
  );
}

export default FarmerFriend;
