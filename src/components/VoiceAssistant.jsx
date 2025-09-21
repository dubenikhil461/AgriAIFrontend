import { useState } from "react";

function VoiceAssistant() {
  const [text, setText] = useState("");

  const handleVoiceInput = () => {
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "ml-IN"; // Malayalam
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      handleQuery(transcript);
    };
    recognition.start();
  };

  const handleQuery = (query) => {
    let response = "";
    if (query.includes("കാലാവസ്ഥ")) response = "ഇന്ന് കാലാവസ്ഥ സൂര്യപ്രകാശമയമാണ്"; // Sunny today
    else if (query.includes("വിലകൾ")) response = "ഇന്നത്തെ കൃഷിവിലകൾ: 100₹ प्रति കിലോ";

    // Speak the response
    const utterance = new SpeechSynthesisUtterance(response);
    utterance.lang = "ml-IN";
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="voice-assistant">
      <h2>Voice Assistant</h2>
      <button onClick={handleVoiceInput}>🎤 Ask</button>
      <p>Query: {text}</p>
    </div>
  );
}

export default VoiceAssistant;
