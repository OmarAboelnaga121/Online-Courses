import Image from "next/image";
import Link from "next/link";

export default function About() {
  const teamMembers = [
    {
      name: "Omar Wael",
      role: "Founder & CEO & Developer & Designer",
      image: "/profile-pic.png",
      bio: "A passionate backend developer and designer with 3+ years of experience, dedicated to building seamless, scalable, and creative web solutions for EduFlex."
    },
  ];

  const features = [
    {
      title: "Wide Variety of Courses",
      description: "From programming to design, business to photography",
      icon: "📚"
    },
    {
      title: "Flexible Learning Schedule",
      description: "Learn at your own pace, anytime, anywhere",
      icon: "⏰"
    },
    {
      title: "Affordable Pricing",
      description: "Quality education accessible to everyone",
      icon: "💰"
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals and experts",
      icon: "👨‍🏫"
    }
  ];

  const whyChoose = [
    {
      title: "Learn from Anywhere",
      description: "Access courses on any device, wherever you are"
    },
    {
      title: "All Skill Levels",
      description: "Beginner to advanced courses for every learner"
    },
    {
      title: "Interactive Content",
      description: "Hands-on projects and practical learning experiences"
    },
    {
      title: "Continuous Updates",
      description: "Fresh content and new courses added regularly"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Empowering Learning, Anywhere, Anytime
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            EduFlex is your flexible gateway to online learning—designed for students, professionals, and lifelong learners.
          </p>
          <Link href="/" className="primaryBtn text-lg px-8 py-4">
            Start Learning Today
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16 space-y-20">
        {/* Our Story */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              EduFlex was born from a simple belief: everyone deserves access to quality education, regardless of their location, schedule, or budget. 
              Founded in 2024, we started as a small team of educators and technologists who saw the potential of online learning to transform lives.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We built EduFlex to break down the barriers that prevent people from learning new skills and advancing their careers. 
              Our platform combines cutting-edge technology with proven educational methods to create an engaging, accessible learning experience.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we're proud to serve thousands of learners worldwide, guided by our core values of quality, flexibility, affordability, and accessibility.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
            <p className="text-gray-700 leading-relaxed">
              To connect learners with quality courses that empower them to achieve their personal and professional goals, 
              making education accessible and flexible for everyone.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
            <p className="text-gray-700 leading-relaxed">
              A world where anyone can learn anything, anywhere, without barriers—where education is a right, not a privilege, 
              and learning never stops.
            </p>
          </div>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Meet the Team */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-all hover:scale-105">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image 
                    src={member.image} 
                    alt={member.name} 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose EduFlex */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose EduFlex</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {whyChoose.map((item, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Learning Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners who are already transforming their careers with EduFlex.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Courses
            </Link>
            <Link href="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Join Now
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}