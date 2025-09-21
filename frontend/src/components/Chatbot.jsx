import { useState, useRef, useEffect } from "react";

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! I am AgriAI bot. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const messagesEndRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { sender: "user", text: userMessage }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const botReply = data.reply || "Sorry, something went wrong!";

      setMessages(prev => [...prev, { sender: "bot", text: botReply }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, something went wrong!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open)
    return (
      <button
        className="fixed bottom-6 right-6 bg-green-700 text-white px-3 py-1 rounded-full shadow-lg hover:bg-green-800"
        onClick={() => setOpen(true)}
      >
        Chat
      </button>
    );

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 text-sm">
      <div className="bg-green-700 text-white p-2 font-semibold flex justify-between items-center">
        <span>AgriAI Chatbot</span>
        <button onClick={() => setOpen(false)} className="text-white font-bold px-2">
          ✕
        </button>
      </div>

      <div className="flex-1 p-2 overflow-y-auto h-64 flex flex-col">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 px-2 py-1 rounded-lg max-w-[80%] ${
              msg.sender === "user"
                ? "bg-green-100 text-green-900 self-end ml-auto"
                : "bg-gray-100 text-gray-800 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-500 text-xs self-start animate-pulse">Typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex border-t border-gray-300">
        <input
          type="text"
          className="flex-1 p-1 text-sm focus:outline-none"
          placeholder="Type..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-green-700 text-white px-3 font-semibold hover:bg-green-800"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
