"use client";
import { useState } from "react";

export default function Terms() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "definitions", title: "Definitions" },
    { id: "eligibility", title: "Eligibility" },
    { id: "account", title: "Account Registration" },
    { id: "responsibilities", title: "User Responsibilities" },
    { id: "content", title: "Courses and Content" },
    { id: "payments", title: "Payments and Refunds" },
    { id: "instructor", title: "Instructor Terms" },
    { id: "ip", title: "Intellectual Property" },
    { id: "prohibited", title: "Prohibited Activities" },
    { id: "disclaimers", title: "Disclaimers" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "termination", title: "Termination" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "changes", title: "Changes to Terms" },
    { id: "law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Please read these terms carefully before using EduFlex. By accessing our platform, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        <div className="flex gap-8">
          {/* Sticky Table of Contents */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`cursor-pointer w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 font-medium"
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      {index + 1}. {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <section id="introduction" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">1</span>
                Introduction
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Welcome to EduFlex, an online educational platform that provides courses, resources, and related services. 
                  By accessing or using our website and services, you agree to be bound by these Terms and Conditions.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you do not agree with any part of these terms, you may not access or use our services.
                </p>
              </div>
            </section>

            <section id="definitions" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">2</span>
                Definitions
              </h2>
              <div className="grid gap-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <strong className="text-gray-900">&quot;Platform&quot; or &quot;Website&quot;:</strong>
                  <p className="text-gray-700 mt-1">The EduFlex website and mobile applications</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-gray-900">&quot;User,&quot; &quot;Student,&quot; or &quot;You&quot;:</strong>
                  <p className="text-gray-700 mt-1">Any person who accesses or uses our services</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <strong className="text-gray-900">&quot;Instructor&quot;:</strong>
                  <p className="text-gray-700 mt-1">Content creators who provide courses on our platform</p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <strong className="text-gray-900">&quot;Content&quot;:</strong>
                  <p className="text-gray-700 mt-1">All materials, courses, videos, and resources available on EduFlex</p>
                </div>
                <div className="border-l-4 border-teal-500 pl-4">
                  <strong className="text-gray-900">&quot;Services&quot;:</strong>
                  <p className="text-gray-700 mt-1">All features and functionalities provided by EduFlex</p>
                </div>
                <div className="border-l-4 border-pink-500 pl-4">
                  <strong className="text-gray-900">&quot;Account&quot;:</strong>
                  <p className="text-gray-700 mt-1">Your registered user profile on our platform</p>
                </div>
              </div>
            </section>

            <section id="eligibility" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">3</span>
                Eligibility
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  To use EduFlex, you must be at least 18 years old or have parental consent if you are a minor. 
                  You must have the legal capacity to enter into binding agreements.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you represent that you meet these eligibility requirements.
                </p>
              </div>
            </section>

            <section id="account" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">4</span>
                Account Registration
              </h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You must create an account to access most features of our platform</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You are responsible for maintaining the security of your login credentials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You must provide accurate and complete information during registration</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You are responsible for all activities that occur under your account</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Notify us immediately of any unauthorized use of your account</p>
                </div>
              </div>
            </section>

            <section id="responsibilities" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">5</span>
                User Responsibilities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">As a user of EduFlex, you agree to:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Comply with all applicable laws and regulations</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Use the platform only for lawful purposes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Respect the intellectual property rights of others</p>
                </div>
              </div>
            </section>

            <section id="content" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">6</span>
                Courses and Content
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                EduFlex serves as a marketplace connecting students with instructors. Course content is owned by 
                the respective instructors or EduFlex, as indicated.
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Course access is granted for personal, non-commercial use only</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You may not share, distribute, or resell course materials</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Course access is non-transferable</p>
                </div>
              </div>
            </section>

            <section id="payments" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">7</span>
                Payments and Refunds
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">Payment and refund policies:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">All prices are displayed in USD unless otherwise specified</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Payment is required before accessing paid courses</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Refunds are available within 30 days of purchase if less than 30% of the course is completed</p>
                </div>
              </div>
            </section>

            <section id="instructor" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">8</span>
                Instructor Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">For users who create and publish courses:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You retain ownership of your original content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You grant EduFlex a license to host and distribute your content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">You must ensure your content does not infringe on third-party rights</p>
                </div>
              </div>
            </section>

            <section id="ip" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">9</span>
                Intellectual Property
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  EduFlex owns all rights to the platform, including our logo, branding, and proprietary features. 
                  Users must respect all intellectual property rights.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  If you believe your intellectual property has been infringed, please contact us immediately.
                </p>
              </div>
            </section>

            <section id="prohibited" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">10</span>
                Prohibited Activities
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">The following activities are strictly prohibited:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Uploading harmful, abusive, or illegal content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Attempting to hack, disrupt, or compromise platform security</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Spamming or unauthorized advertising</p>
                </div>
              </div>
            </section>

            <section id="disclaimers" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">11</span>
                Disclaimers
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                EduFlex provides educational content for informational purposes only. We make no guarantees about:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">The accuracy or completeness of course content</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Specific learning outcomes or results</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Career advancement or job placement</p>
                </div>
              </div>
            </section>

            <section id="liability" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">12</span>
                Limitation of Liability
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  EduFlex&apos;s liability is limited to the maximum extent permitted by law. In no event shall our 
                  total liability exceed the amount you paid for services in the 6 months preceding the claim.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We are not liable for indirect, incidental, or consequential damages.
                </p>
              </div>
            </section>

            <section id="termination" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">13</span>
                Termination
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account at any time for violation of these terms. 
                Upon termination:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Your access to courses and content will be revoked</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Your account data may be deleted</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">No refunds will be provided for terminated accounts due to policy violations</p>
                </div>
              </div>
            </section>

            <section id="privacy" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">14</span>
                Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, 
                use, and protect your personal information. By using our services, you agree to our privacy practices.
              </p>
            </section>

            <section id="changes" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">15</span>
                Changes to Terms
              </h2>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  We reserve the right to modify these Terms and Conditions at any time. Changes will be effective 
                  immediately upon posting on our website.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </div>
            </section>

            <section id="law" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">16</span>
                Governing Law
              </h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms and Conditions are governed by the laws of the Arab Republic of Egypt. Any disputes will be resolved in the courts of Alexandria, Egypt.
              </p>
            </section>

            <section id="contact" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">17</span>
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms and Conditions, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Email: legal@eduflex.com</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Contact Form: Available on our website</p>
                </div>
    
              </div>
            </section>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-700 leading-relaxed">
            By using EduFlex, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}