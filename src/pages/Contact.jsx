import { useState } from "react";
import Ax from '../utils/Axios'
function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // 'success', 'error', 'loading'
  const [isLoading, setLoading] = useState(false);

  const team = [
    { 
      name: "Binay Mohan Pal", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(IOT)",
    },
    { 
      name: "Mayank Pandey", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(IOT)",
    },
    { 
      name: "Pratik Gupta", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(IOT)",
    },
    { 
      name: "Nikhil Dubey", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(IOT)",
    },
    { 
      name: "Harshvi Kumari", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(AI/ML)",
    },
    { 
      name: "Aryan Shedge", 
      college: "Lokmanya Tilak College of Engineering", 
      branch: "CSE(IOT)",
      role: "IoT Developer",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending your message...");
    setStatusType("loading");
    
    try {
      const res = await Ax.post("/contact", { name, email, message });
      setStatus(res.data.message);
      setStatusType("success");
      setName("");
      setEmail("");
      setMessage("");
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setStatus("");
        setStatusType("");
      }, 5000);
    } catch (err) {
      setStatus("Failed to send message. Please try again.");
      setStatusType("error");
      console.error(err);
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setStatus("");
        setStatusType("");
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = () => {
    if (statusType === "success") return "text-green-700 bg-green-100 border-green-300";
    if (statusType === "error") return "text-red-700 bg-red-100 border-red-300";
    if (statusType === "loading") return "text-blue-700 bg-blue-100 border-blue-300";
    return "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-700 py-16">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
            🌱 Contact AgriAI
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed">
            Get in touch with our agricultural AI experts. We're here to revolutionize farming with technology.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-50 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Contact Form Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-green-100 hover:shadow-3xl transition-all duration-500">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-green-900 mb-3">Send us a Message</h2>
              <p className="text-gray-600">
                Whether you're a farmer, researcher, or technology enthusiast, we'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-green-800 font-semibold mb-2 group-focus-within:text-green-600 transition-colors">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-green-300"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-green-800 font-semibold mb-2 group-focus-within:text-green-600 transition-colors">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-green-300"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Message Field */}
              <div className="group">
                <label className="block text-green-800 font-semibold mb-2 group-focus-within:text-green-600 transition-colors">
                  Your Message
                </label>
                <textarea
                  placeholder="Tell us about your agricultural challenges, ideas, or how we can help..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 resize-none focus:border-green-500 focus:outline-none transition-all duration-300 hover:border-green-300"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:from-green-700 hover:to-emerald-800 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Send Message
                  </>
                )}
              </button>

              {/* Status Message */}
              {status && (
                <div className={`p-4 rounded-xl border text-center font-medium animate-fade-in ${getStatusClasses()}`}>
                  {statusType === "loading" && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-700 border-t-transparent"></div>
                      {status}
                    </div>
                  )}
                  {statusType === "success" && (
                    <div className="flex items-center justify-center gap-2">
                      <span>✅</span>
                      {status}
                    </div>
                  )}
                  {statusType === "error" && (
                    <div className="flex items-center justify-center gap-2">
                      <span>❌</span>
                      {status}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Why Contact Us?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🌾</span>
                  <div>
                    <h4 className="font-semibold mb-1">Agricultural Innovation</h4>
                    <p className="text-green-100">Cutting-edge AI solutions for modern farming challenges.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h4 className="font-semibold mb-1">Partnership Opportunities</h4>
                    <p className="text-green-100">Collaborate with us on agricultural technology projects.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-2xl">🎓</span>
                  <div>
                    <h4 className="font-semibold mb-1">Research & Development</h4>
                    <p className="text-green-100">Join our research initiatives in agricultural AI.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-green-100">
              <h3 className="text-2xl font-bold text-green-900 mb-4">Quick Response</h3>
              <p className="text-gray-600 mb-4">
                Our team typically responds within 24 hours. For urgent inquiries, please mention it in your message.
              </p>
              <div className="flex items-center gap-2 text-green-700">
                <span>⏰</span>
                <span className="font-semibold">Average response time: 6-12 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Meet Our AgriAI Team
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A passionate group of engineers and researchers dedicated to transforming agriculture through artificial intelligence and IoT technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-green-100 group"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {member.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-semibold text-sm mb-2">{member.role}</p>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-green-800">College:</span><br />
                    {member.college}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-semibold text-green-800">Branch:</span> {member.branch}
                  </p>
                </div>
               
              </div>

              <div className="mt-6 pt-4 border-t border-green-100">
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <span>🌱</span>
                  <span className="text-xs font-medium">AgriAI Team Member</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contact;