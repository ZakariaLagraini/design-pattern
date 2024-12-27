export default function AboutUs() {
  const teamMembers = [
    { name: "Hamza El aloui", role: "Software Engineering Student" },
    { name: "Jord Reda", role: "Software Engineering Student" },
    { name: "Zakaria Lagraini", role: "Software Engineering Student" },
    { name: "Morad Elmaslouhy", role: "Software Engineering Student" },
    { name: "Khlil Azarou", role: "Software Engineering Student" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 mb-4">
              About Design Pattern Generator
            </h1>
            <p className="text-xl text-gray-600">
              Empowering developers with intelligent design pattern solutions
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We strive to make software architecture more accessible by providing intelligent
              analysis and recommendations for design patterns. Our AI-powered tool helps
              developers make better architectural decisions and implement the most suitable
              patterns for their projects.
            </p>
          </div>

          {/* Team Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Our Team</h2>
            </div>
            <div className="text-gray-600 leading-relaxed mb-6">
              We are a group of passionate software engineering students from EMSI (École Marocaine des Sciences de l'Ingénieur) in Morocco. Our diverse team brings together different perspectives and skills to create innovative solutions.
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {teamMembers.map((member, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 transform transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="font-semibold text-gray-900">{member.name}</div>
                  <div className="text-gray-600 text-sm">{member.role}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-primary-500 to-indigo-500 rounded-lg p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 ml-4">Get in Touch</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Have questions or suggestions? We'd love to hear from you! Reach out to us at:
            </p>
            <a 
              href="mailto:contact@designpatterngenerator.com" 
              className="inline-flex items-center text-primary-600 hover:text-primary-700 transition-colors duration-300"
            >
              <span className="underline">contact@designpatterngenerator.com</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 