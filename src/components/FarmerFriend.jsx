import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageCircle,
  Sparkles,
  Globe,
  AlertTriangle,
  Bell,
  CloudLightning,
  Leaf,
  Droplets,
  Target,
  MessageSquareText, // New icon for conversation list
} from "lucide-react";

// ✅ Toast/Alert Component for Mobile style alerts
function MobileAlert({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl z-50 flex items-center gap-2 transition-opacity duration-300 animate-slide-up">
      <Bell className="w-5 h-5" />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 font-bold opacity-75 hover:opacity-100 transition-opacity">
        &times;
      </button>
    </div>
  );
}

// ✅ Main Application Component
function FarmerFriend() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [response, setResponse] = useState("");
  const [conversation, setConversation] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [confidence, setConfidence] = useState(0);
  // Default language set to English, but now changeable
  const [selectedLanguage, setSelectedLanguage] = useState("en-US"); 
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // ✅ Language support (English and Malayalam)
  const languages = {
    "en-US": { name: "English", voice: "en-US", flag: "🇺🇸" },
    "ml-IN": { name: "മലയാളം", voice: "ml-IN", flag: "🇮🇳" },
  };

  // ✅ General Kerala Agriculture Query Database with Malayalam translations
  const queryDatabase = {
    // English keywords: "main crop"
    "main crop": {
      responses: {
        "en-US": "The most cultivated crops in Kerala by land area are Coconut, Rubber, Rice (Paddy), and Banana. Cash crops like spices are also highly important.",
        "ml-IN": "കേരളത്തിൽ ഏറ്റവും കൂടുതൽ കൃഷി ചെയ്യുന്ന വിളകൾ തെങ്ങ്, റബ്ബർ, നെല്ല്, വാഴ എന്നിവയാണ്. സുഗന്ധവ്യഞ്ജനങ്ങൾ പോലുള്ള നാണ്യവിളകളും വളരെ പ്രധാനപ്പെട്ടതാണ്.",
      },
      icon: <Target className="w-5 h-5 text-red-600" />,
      category: "Major Crops",
    },
    // Malayalam keywords: "പ്രധാന വിള" (Pramukha Vila)
    "പ്രധാന വിള": {
        responses: {
          "en-US": "The most cultivated crops in Kerala by land area are Coconut, Rubber, Rice (Paddy), and Banana. Cash crops like spices are also highly important.",
          "ml-IN": "കേരളത്തിൽ ഏറ്റവും കൂടുതൽ കൃഷി ചെയ്യുന്ന വിളകൾ തെങ്ങ്, റബ്ബർ, നെല്ല്, വാഴ എന്നിവയാണ്. സുഗന്ധവ്യഞ്ജനങ്ങൾ പോലുള്ള നാണ്യവിളകളും വളരെ പ്രധാനപ്പെട്ടതാണ്.",
        },
        icon: <Target className="w-5 h-5 text-red-600" />,
        category: "Major Crops",
      },
    // English keywords: "soil"
    "soil": {
      responses: {
        "en-US": "Kerala's dominant soil type is highly leached red lateritic soil, which is generally acidic and poor in fertility, often requiring lime application.",
        "ml-IN": "കേരളത്തിലെ പ്രധാന മണ്ണ് ലാറ്ററൈറ്റ് മണ്ണാണ്. ഇത് പൊതുവെ പുളിരസമുള്ളതും ഫലഭൂയിഷ്ഠത കുറഞ്ഞതുമാണ്, അതിനാൽ കുമ്മായം ചേർക്കേണ്ടിവരും.",
      },
      icon: <Globe className="w-5 h-5 text-yellow-600" />,
      category: "Soil Type",
    },
    // Malayalam keywords: "മണ്ണ്" (Mannu)
    "മണ്ണ്": {
        responses: {
          "en-US": "Kerala's dominant soil type is highly leached red lateritic soil, which is generally acidic and poor in fertility, often requiring lime application.",
          "ml-IN": "കേരളത്തിലെ പ്രധാന മണ്ണ് ലാറ്ററൈറ്റ് മണ്ണാണ്. ഇത് പൊതുവെ പുളിരസമുള്ളതും ഫലഭൂയിഷ്ഠത കുറഞ്ഞതുമാണ്, അതിനാൽ കുമ്മായം ചേർക്കേണ്ടിവരും.",
        },
        icon: <Globe className="w-5 h-5 text-yellow-600" />,
        category: "Soil Type",
      },
    // English keywords: "spice"
    "spice": {
      responses: {
        "en-US": "Kerala is famous as the 'Spice Garden of India.' Common spices are Black Pepper, Cardamom, Ginger, Nutmeg, and Turmeric. Cardamom is often called the 'Queen of Spices.'",
        "ml-IN": "കേരളം 'ഇന്ത്യയുടെ സുഗന്ധവ്യഞ്ജന തോട്ടം' എന്നറിയപ്പെടുന്നു. കുരുമുളക്, ഏലം, ഇഞ്ചി, ജാതിക്ക, മഞ്ഞൾ എന്നിവയാണ് പ്രധാന സുഗന്ധവ്യഞ്ജനങ്ങൾ. ഏലത്തെ 'സുഗന്ധവ്യഞ്ജനങ്ങളുടെ രാജ്ഞി' എന്ന് വിളിക്കുന്നു.",
      },
      icon: <Leaf className="w-5 h-5 text-green-700" />,
      category: "Spices",
    },
    // Malayalam keywords: "സുഗന്ധവ്യഞ്ജനം" (Sugandhavyanjanam)
    "സുഗന്ധവ്യഞ്ജനം": {
        responses: {
          "en-US": "Kerala is famous as the 'Spice Garden of India.' Common spices are Black Pepper, Cardamom, Ginger, Nutmeg, and Turmeric. Cardamom is often called the 'Queen of Spices.'",
          "ml-IN": "കേരളം 'ഇന്ത്യയുടെ സുഗന്ധവ്യഞ്ജന തോട്ടം' എന്നറിയപ്പെടുന്നു. കുരുമുളക്, ഏലം, ഇഞ്ചി, ജാതിക്ക, മഞ്ഞൾ എന്നിവയാണ് പ്രധാന സുഗന്ധവ്യഞ്ജനങ്ങൾ. ഏലത്തെ 'സുഗന്ധവ്യഞ്ജനങ്ങളുടെ രാജ്ഞി' എന്ന് വിളിക്കുന്നു.",
        },
        icon: <Leaf className="w-5 h-5 text-green-700" />,
        category: "Spices",
      },
    // English keywords: "rain"
    "rain": {
      responses: {
        "en-US": "Kerala agriculture is highly dependent on the Southwest Monsoon (June to September). Traditional crops like rice have three main seasons: Virippu, Mundakan, and Puncha.",
        "ml-IN": "കേരളത്തിലെ കൃഷി പ്രധാനമായും തെക്കുപടിഞ്ഞാറൻ മൺസൂണിനെ (ജൂൺ മുതൽ സെപ്റ്റംബർ വരെ) ആശ്രയിച്ചിരിക്കുന്നു. നെൽകൃഷിക്ക് വിരിപ്പ്, മുണ്ടകൻ, പുഞ്ച എന്നിങ്ങനെ മൂന്ന് പ്രധാന സീസണുകളുണ്ട്.",
      },
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      category: "Rain/Season",
    },
    // Malayalam keywords: "മഴ" (Mazha)
    "മഴ": {
        responses: {
          "en-US": "Kerala agriculture is highly dependent on the Southwest Monsoon (June to September). Traditional crops like rice have three main seasons: Virippu, Mundakan, and Puncha.",
          "ml-IN": "കേരളത്തിലെ കൃഷി പ്രധാനമായും തെക്കുപടിഞ്ഞാറൻ മൺസൂണിനെ (ജൂൺ മുതൽ സെപ്റ്റംബർ വരെ) ആശ്രയിച്ചിരിക്കുന്നു. നെൽകൃഷിക്ക് വിരിപ്പ്, മുണ്ടകൻ, പുഞ്ച എന്നിങ്ങനെ മൂന്ന് പ്രധാന സീസണുകളുണ്ട്.",
        },
        icon: <Droplets className="w-5 h-5 text-blue-500" />,
        category: "Rain/Season",
      },
    // English keywords: "rubber"
    "rubber": {
        responses: {
          "en-US": "Rubber is a major plantation crop in Kerala, often grown on the hilly terrains. It is a key contributor to the state's economy, but requires careful tapping and maintenance.",
          "ml-IN": "റബ്ബർ കേരളത്തിലെ ഒരു പ്രധാന തോട്ടവിളയാണ്, ഇത് കുന്നിൻ പ്രദേശങ്ങളിൽ കൃഷി ചെയ്യുന്നു. സംസ്ഥാനത്തിൻ്റെ സമ്പദ്‌വ്യവസ്ഥയ്ക്ക് ഇത് ഒരു പ്രധാന പങ്ക് വഹിക്കുന്നു.",
        },
        icon: <CloudLightning className="w-5 h-5 text-gray-700" />,
        category: "Plantation",
      },
    // Malayalam keywords: "റബ്ബർ" (Rubber)
    "റബ്ബർ": {
        responses: {
          "en-US": "Rubber is a major plantation crop in Kerala, often grown on the hilly terrains. It is a key contributor to the state's economy, but requires careful tapping and maintenance.",
          "ml-IN": "റബ്ബർ കേരളത്തിലെ ഒരു പ്രധാന തോട്ടവിളയാണ്, ഇത് കുന്നിൻ പ്രദേശങ്ങളിൽ കൃഷി ചെയ്യുന്നു. സംസ്ഥാനത്തിൻ്റെ സമ്പദ്‌വ്യവസ്ഥയ്ക്ക് ഇത് ഒരു പ്രധാന പങ്ക് വഹിക്കുന്നു.",
        },
        icon: <CloudLightning className="w-5 h-5 text-gray-700" />,
        category: "Plantation",
      },
    // Help query (handles both languages)
    "help": {
      responses: {
        "en-US": "I am FarmerFriend, focused on Kerala agriculture! Ask me general questions about **main crops**, **soil**, **spices**, **rain/seasons**, or **rubber**.",
        "ml-IN": "ഞാൻ കർഷക സുഹൃത്താണ്, കേരള കൃഷിയെക്കുറിച്ചാണ് എൻ്റെ ശ്രദ്ധ! **പ്രധാന വിളകൾ**, **മണ്ണ്**, **സുഗന്ധവ്യഞ്ജനങ്ങൾ**, **മഴ/സീസണുകൾ**, അല്ലെങ്കിൽ **റബ്ബർ** എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് പൊതുവായ ചോദ്യങ്ങൾ ചോദിക്കാം.",
      },
      icon: <Sparkles className="w-5 h-5 text-green-600" />,
      category: "Assistant",
    },
  };

  // ✅ LIST OF GENERAL QUESTIONS TO ASK (English and Malayalam)
  const generalQuestions = [
    {
        en: "What are the main crops of Kerala?",
        ml: "കേരളത്തിലെ പ്രധാന വിളകൾ ഏതെല്ലാമാണ്?",
    },
    {
        en: "Tell me about the soil in Kerala.",
        ml: "കേരളത്തിലെ മണ്ണിനെക്കുറിച്ച് പറയുക.",
    },
    {
        en: "Which spices are important in Kerala?",
        ml: "കേരളത്തിലെ പ്രധാന സുഗന്ധവ്യഞ്ജനങ്ങൾ ഏതാണ്?",
    },
    {
        en: "How does the rain affect farming in Kerala?",
        ml: "മഴ കേരളത്തിലെ കൃഷിയെ എങ്ങനെ ബാധിക്കുന്നു?",
    },
    {
        en: "What is the status of rubber cultivation?",
        ml: "റബ്ബർ കൃഷിയുടെ നിലവിലെ സ്ഥിതി എന്താണ്?",
    }
  ];
  
  // --- Speech Recognition Setup & Handlers ---

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
      if (text && !response) {
          handleQuery(text);
      }
    };

    return true;
  };

  const handleVoiceInput = () => {
    if (showMaintenance) {
        setAlertMessage("🚨 Maintenance Mode is ON. Please turn it OFF to use the mic.");
        return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      return;
    }
    if (!recognitionRef.current && !initializeSpeechRecognition()) {
      return;
    }
    setText("");
    setResponse("");
    setConfidence(0);
    recognitionRef.current.start();
  };
  
  // ✅ Query handling
  const handleQuery = (query) => {
    recognitionRef.current?.stop(); 

    let matchedResponse = null;
    const lowerCaseQuery = query.toLowerCase();

    for (const [key, data] of Object.entries(queryDatabase)) {
      if (lowerCaseQuery.includes(key.toLowerCase())) { // Match query to keys
        matchedResponse = data;
        break;
      }
    }

    const defaultResponse = {
      "en-US": "Sorry, I didn't understand. Try asking a general question about **main crops**, **soil**, or **spices** in Kerala.",
      "ml-IN": "ക്ഷമിക്കണം, എനിക്ക് മനസ്സിലായില്ല. **പ്രധാന വിളകൾ**, **മണ്ണ്**, അല്ലെങ്കിൽ **സുഗന്ധവ്യഞ്ജനങ്ങൾ** എന്നിവയെക്കുറിച്ച് പൊതുവായ ചോദ്യങ്ങൾ ചോദിക്കാൻ ശ്രമിക്കുക.",
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
    const voices = window.speechSynthesis.getVoices();
    // Find the best matching voice for the selected language
    const voice = voices.find(v => v.lang.startsWith(selectedLanguage.substring(0, 2)));

    if (voice) {
        utterance.voice = voice;
    }

    utterance.lang = selectedLanguage;
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        setIsSpeaking(false);
        console.error("SpeechSynthesis Error: ", e);
    };
    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleLanguageChange = (langCode) => {
    stopSpeaking();
    setSelectedLanguage(langCode);
    if (recognitionRef.current) recognitionRef.current.lang = langCode;
    setAlertMessage(`🌐 Language changed to ${languages[langCode].name}`);
  };

  useEffect(() => {
    window.speechSynthesis.getVoices(); 
    return () => {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
    };
  }, []);

  // Tailwind CSS keyframes for animations
  const customStyles = `
    @keyframes slide-up {
      from { transform: translate(-50%, 100px); opacity: 0; }
      to { transform: translate(-50%, 0); opacity: 1; }
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.3); opacity: 0.8; }
      100% { transform: scale(1.5); opacity: 0; }
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 text-gray-800">
      <style>{customStyles}</style>
      
      {/* ✅ Mobile Alert */}
      <MobileAlert message={alertMessage} onClose={() => setAlertMessage("")} />

      <div className="max-w-3xl mx-auto p-4">
        {/* Header and Controls */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-4xl font-extrabold text-green-800 flex items-center justify-center gap-3">
            <Leaf className="w-8 h-8 text-green-600" />
            കർഷക മിത്രം | FarmerFriend
          </h1>
          <p className="text-gray-600 text-md font-medium mt-1">
            General Agricultural Voice Assistant for Kerala
          </p>

          <div className="flex justify-center items-center gap-4 mt-4 text-sm">
            {/* Maintenance Toggle */}
            <div className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${showMaintenance ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                <AlertTriangle className="w-4 h-4" />
                <span className="font-semibold">Maintenance Mode</span>
                <button
                    onClick={() => {
                        setShowMaintenance(!showMaintenance);
                        setAlertMessage(`Maintenance Mode ${!showMaintenance ? 'ON (🚫 Mic)' : 'OFF (✅ Mic)'}`);
                    }}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        showMaintenance ? 'bg-red-500' : 'bg-green-600'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            showMaintenance ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex justify-center gap-3 mt-4">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
                  selectedLanguage === code
                    ? "bg-green-600 text-white shadow-green-400/50"
                    : "bg-white border border-green-300 text-green-700 hover:bg-green-50"
                }`}
              >
                {lang.flag} {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Voice control */}
        <div className="flex flex-col items-center my-8">
          <div className="relative">
            {/* Listening Pulse Animation */}
            {isListening && (
              <div
                key={animationKey}
                className="absolute inset-0 bg-red-500 opacity-50 rounded-full"
                style={{ animation: 'pulse-ring 1.5s infinite' }}
              ></div>
            )}
            
            <button
              onClick={handleVoiceInput}
              disabled={showMaintenance}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all relative z-10 
                ${isListening 
                  ? "bg-red-600 hover:bg-red-700" 
                  : showMaintenance 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-green-600 hover:bg-green-700"
                }
              `}
            >
              {isListening 
                ? <MicOff className="w-10 h-10 text-white" /> 
                : <Mic className="w-10 h-10 text-white" />
              }
            </button>
          </div>
          
          {/* Status Indicator */}
          <div className="mt-4 h-6 text-center">
            {isListening && <p className="text-red-600 font-semibold flex items-center gap-2">Listening... <span className="w-2 h-2 rounded-full bg-red-600 animate-bounce"></span></p>}
            {isSpeaking && (
              <button onClick={stopSpeaking} className="text-blue-600 font-semibold flex items-center gap-2 hover:underline">
                <Volume2 className="w-5 h-5 animate-pulse" />
                Speaking... (Click to stop)
              </button>
            )}
            {!isListening && !isSpeaking && !response && <p className="text-gray-500 font-medium">Click the mic to ask a question.</p>}
          </div>
          
          {/* Confidence Score */}
          {text && confidence > 0 && (
            <p className="text-xs text-gray-500 mt-2">
              Confidence: **{confidence}%**
            </p>
          )}
        </div>

        {/* Query & Response Card */}
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-green-200">
            <h2 className="text-2xl font-bold mb-4 text-green-700 flex items-center gap-2">
                <MessageSquareText className="w-6 h-6" /> Latest Interaction
            </h2>
            
            {text && (
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
                    <p className="font-semibold text-blue-800">Your Query:</p>
                    <p className="text-gray-700 italic mt-1">{text}</p>
                </div>
            )}

            {response && (
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                    <p className="font-semibold text-green-800">FarmerFriend Response:</p>
                    <p className="text-gray-700 mt-1">{response}</p>
                </div>
            )}
            
            {!response && !text && (
                <p className="text-gray-500 text-center py-4">
                    Waiting for your first voice query... Select a language and ask a question.
                </p>
            )}
        </div>

        {/* General Questions to Ask */}
        <div className="mt-8 p-6 bg-yellow-50 rounded-xl shadow-inner border border-yellow-200">
            <h2 className="text-xl font-bold mb-3 text-yellow-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Questions to Ask
            </h2>
            <p className="text-sm text-gray-700 mb-4">
                Click on a question to instantly ask FarmerFriend in the selected language:
            </p>
            <ul className="grid grid-cols-1 gap-3 list-none text-sm text-gray-600">
                {generalQuestions.map((q, index) => {
                    const questionText = selectedLanguage === 'ml-IN' ? q.ml : q.en;
                    const queryKey = selectedLanguage === 'ml-IN' ? q.ml.split(' ')[0] : q.en.split(' ')[2];

                    return (
                        <li key={index} 
                            className="p-3 bg-white rounded-lg shadow-md hover:bg-green-50 transition-all cursor-pointer border border-gray-200" 
                            onClick={() => {
                                // Use the appropriate query key for the backend lookup
                                setText(questionText);
                                handleQuery(queryKey);
                            }}>
                            <span className="font-semibold text-green-700">Q:</span> {questionText}
                        </li>
                    );
                })}
            </ul>
        </div>
      </div>
    </div>
  );
}

export default FarmerFriend;