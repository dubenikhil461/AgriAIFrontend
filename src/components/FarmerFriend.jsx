import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageCircle, Sparkles, Sun, TrendingUp, Calendar, MapPin, Globe, AlertTriangle } from "lucide-react";

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
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Language configurations for Kerala
  const languages = {
    "en-US": { name: "English", voice: "en-US", flag: "🇺🇸" },
    "ml-IN": { name: "മലയാളം", voice: "ml-IN", flag: "🇮🇳" },
  };

  // Multilingual query responses for Kerala
  const queryDatabase = {
    "weather": {
      responses: {
        "en-US": "Today's weather in Kerala is partly cloudy with a chance of rain. The temperature is around 29°C with 83% humidity. It's advisable to be prepared for showers.",
        "ml-IN": "ഇന്നത്തെ കേരളത്തിലെ കാലാവസ്ഥ ഭാഗികമായി മേഘാവൃതമാണ്, മഴയ്ക്ക് സാധ്യതയുണ്ട്. താപനില 29°C ആണ്, ആർദ്രത 83% ആണ്. മഴയ്ക്ക് തയ്യാറാകുന്നത് നല്ലതാണ്.",
      },
      icon: <Sun className="w-5 h-5 text-yellow-500" />,
      category: "Weather"
    },
    "price": {
      responses: {
        "en-US": "Current market prices in Kerala: Rice ₹50/kg, Coconut ₹35/piece, Rubber ₹175/kg, Pepper ₹700/kg.",
        "ml-IN": "കേരളത്തിലെ ഇപ്പോഴത്തെ വിപണി വില: അരി ₹50/കിലോ, തേങ്ങ ₹35/എണ്ണം, റബ്ബർ ₹175/കിലോ, കുരുമുളക് ₹700/കിലോ.",
      },
      icon: <TrendingUp className="w-5 h-5 text-green-600" />,
      category: "Market"
    },
    "help": {
      responses: {
        "en-US": "I am FarmerFriend, your agricultural assistant for Kerala! Ask me about weather, market prices, farming tips, and more!",
        "ml-IN": "ഞാൻ ഫാർമർഫ്രണ്ട്, കേരളത്തിലെ നിങ്ങളുടെ കാർഷിക സഹായി! കാലാവസ്ഥ, വിപണി വില, കൃഷി നുറുങ്ങുകൾ എന്നിവയെക്കുറിച്ച് എന്നോട് ചോദിക്കൂ!",
      },
      icon: <Sparkles className="w-5 h-5 text-green-600" />,
      category: "Assistant"
    }
  };

  const initializeSpeechRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return false;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = selectedLanguage;
    recognitionRef.current.maxAlternatives = 3;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setAnimationKey(prev => prev + 1);
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
      console.error('Speech recognition error:', event.error);
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

  const handleQuery = (query) => {
    let matchedResponse = null;
    let matchedKey = "";

    // Find matching query
    for (const [key, data] of Object.entries(queryDatabase)) {
      if (query.toLowerCase().includes(key) || query.includes(key)) {
        matchedResponse = data;
        matchedKey = key;
        break;
      }
    }

    const defaultResponse = {
      "en-US": "Sorry, I didn't understand that. Try asking about weather, prices, or farming tips!",
      "ml-IN": "ക്ഷമിക്കണം, എനിക്കത് മനസ്സിലായില്ല. കാലാവസ്ഥ, വില, അല്ലെങ്കിൽ കൃഷി നുറുങ്ങുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാൻ ശ്രമിക്കുക!",
    };

    const finalResponse = matchedResponse 
      ? matchedResponse.responses[selectedLanguage] 
      : defaultResponse[selectedLanguage];

    setResponse(finalResponse);
    
    // Add to conversation history
    const newEntry = {
      id: Date.now(),
      query: query,
      response: finalResponse,
      timestamp: new Date().toLocaleTimeString(),
      icon: matchedResponse?.icon,
      category: matchedResponse?.category || "General",
      confidence: confidence,
      language: languages[selectedLanguage].name
    };
    
    setConversation(prev => [newEntry, ...prev.slice(0, 4)]);

    // Speak the response
    speakResponse(finalResponse);
  };

  const speakResponse = (text) => {
    if (synthRef.current) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage;
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

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
    if (recognitionRef.current) {
      recognitionRef.current.lang = langCode;
    }
  };

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 text-gray-800">
      {/* Maintenance Alert */}
      {showMaintenance && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-100 border-b-2 border-yellow-300">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-800 font-medium">
                  🚧 System is currently under maintenance. Some features may be limited. Thank you for your patience!
                </span>
              </div>
              <button
                onClick={() => setShowMaintenance(false)}
                className="text-yellow-800 hover:text-yellow-900 text-xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 container mx-auto px-4 ${showMaintenance ? 'pt-20 pb-8' : 'py-8'}`}>
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              FarmerFriend
            </h1>
            <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-green-800 rounded-full flex items-center justify-center">
              <span className="text-2xl">🌱</span>
            </div>
          </div>
          <p className="text-gray-600 text-lg mb-4">Your Agricultural Voice Assistant for Kerala</p>
          
          {/* Language Selector */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Select Language:</span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleLanguageChange(code)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  selectedLanguage === code
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white border border-green-200 text-green-700 hover:bg-green-50'
                }`}
              >
                <span>{lang.flag}</span>
                {lang.name}
              </button>
            ))}
          </div>
        </div>

        {/* Main Interface */}
        <div className="max-w-4xl mx-auto">
          {/* Voice Control Panel */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 mb-8 border-2 border-white/50 shadow-2xl">
            <div className="flex flex-col items-center space-y-6">
              {/* Microphone Button with Animation */}
              <div className="relative">
                <button
                  onClick={handleVoiceInput}
                  className={`relative w-24 h-24 rounded-full transition-all duration-300 transform hover:scale-110 ${
                    isListening
                      ? 'bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/50 animate-pulse'
                      : 'bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg hover:shadow-green-500/50'
                  }`}
                  disabled={isSpeaking}
                >
                  {isListening ? (
                    <MicOff className="w-10 h-10 mx-auto text-white" />
                  ) : (
                    <Mic className="w-10 h-10 mx-auto text-white" />
                  )}
                </button>
                
                {/* Listening Animation Rings */}
                {isListening && (
                  <div key={animationKey} className="absolute inset-0">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute inset-0 rounded-full border-2 border-red-400/50 animate-ping"
                        style={{
                          animationDelay: `${i * 0.5}s`,
                          animationDuration: '2s'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-xl font-semibold mb-2">
                  {isListening 
                    ? (selectedLanguage === 'ml-IN' ? 'കേൾക്കുന്നു...' : 'Listening...') 
                    : (selectedLanguage === 'ml-IN' ? 'മൈക്രോഫോൺ അമർത്തി സംസാരിക്കുക' : 'Press the microphone button and speak')
                  }
                </p>
                <p className="text-sm text-green-600 mb-2">
                  Speaking in: {languages[selectedLanguage].name} {languages[selectedLanguage].flag}
                </p>
                {confidence > 0 && (
                  <p className="text-sm text-gray-500">Confidence: {confidence}%</p>
                )}
              </div>

              {/* Speaking Control */}
              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-600 hover:bg-red-500/30 transition-colors"
                >
                  <VolumeX className="w-4 h-4" />
                  Stop Speaking
                </button>
              )}
            </div>
          </div>

          {/* Current Query & Response */}
          {(text || response) && (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-green-100">
              {text && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Your Question:
                  </h3>
                  <p className="text-xl bg-green-50 border-2 border-green-200 rounded-lg p-4">{text}</p>
                </div>
              )}
              
              {response && (
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <Volume2 className={isSpeaking ? "w-5 h-5 animate-pulse text-green-600" : "w-5 h-5"} />
                    FarmerFriend Says:
                  </h3>
                  <p className="text-xl bg-green-50 border-2 border-green-200 rounded-lg p-4">{response}</p>
                </div>
              )}
            </div>
          )}

          {/* Conversation History */}
          {conversation.length > 0 && (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-green-200 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-800 flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Conversation History
              </h3>
              <div className="space-y-4">
                {conversation.map((entry) => (
                  <div key={entry.id} className="bg-green-50 border-2 border-green-200 rounded-lg p-4 border-l-4 border-l-green-600">
                    <div className="flex items-center gap-2 mb-2">
                      {entry.icon}
                      <span className="text-sm font-medium text-green-700">{entry.category}</span>
                      <span className="text-xs text-gray-500">({entry.language})</span>
                      <span className="text-sm text-gray-500 ml-auto">{entry.timestamp}</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-1">
                      <strong>Q:</strong> {entry.query}
                    </div>
                    <div className="text-sm text-green-800">
                      <strong>A:</strong> {entry.response}
                    </div>
                    {entry.confidence > 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Recognition confidence: {entry.confidence}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Try asking about:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {Object.keys(queryDatabase).map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-green-100 border-2 border-green-300 rounded-full text-green-700 text-sm hover:bg-green-200 transition-colors cursor-pointer"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-4 text-sm text-gray-500">
              🌾 Supporting farmers in Kerala with technology in English and Malayalam 🌱
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerFriend;