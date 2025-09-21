function Contact() {
  const team = [
    { name: "Binay Mohan Pal", college: "Lokmanya Tilak College of Engineering", branch: "CSE(IOT)" },
    { name: "Mayank Pandey", college: "Lokmanya Tilak College of Engineering", branch: "CSE(IOT)" },
    { name: "Pratik Gupta", college: "Lokmanya Tilak College of Engineering", branch: "CSE(IOT)" },
    { name: "Nikhil Dubey", college: "Lokmanya Tilak College of Engineering", branch: "CSE(IOT)"},
    { name: "Harshvi Kumari", college: "Lokmanya Tilak College of Engineering", branch: "CSE(AI/ML)" },
    { name: "Aryan Shedge", college: "Lokmanya Tilak College of Engineering", branch: "CSE(IOT)" },
  ];

  return (
    <div className="min-h-screen bg-green-50 flex flex-col items-center p-10">
      {/* Contact Form */}
      <h1 className="text-5xl font-bold text-green-900 mb-12 drop-shadow-md">
        Contact Us
      </h1>

      <div className="w-full max-w-3xl bg-white rounded-2xl p-8 shadow-xl mb-16">
        <form className="flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col">
            <label className="text-green-800 font-medium mb-2">Name</label>
            <input
              type="text"
              placeholder="Your Name"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-green-800 font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Your Email"
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Message */}
          <div className="flex flex-col">
            <label className="text-green-800 font-medium mb-2">Message</label>
            <textarea
              placeholder="Your Message"
              className="p-3 border border-gray-300 rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-green-800 hover:shadow-lg transition-all duration-200"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Team Members Section */}
      <h2 className="text-4xl font-bold text-green-900 mb-8 drop-shadow-md">
        Meet Our Team
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-green-200 rounded-full mb-4 flex items-center justify-center text-2xl font-bold text-green-800">
              {member.name.split(" ").map(n => n[0]).join("")}
            </div>
            <h3 className="text-xl font-semibold text-green-800">{member.name}</h3>
            <p className="text-gray-700 mt-1 text-center">
              {member.college} <br />
              {member.branch} <br />
              
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;
