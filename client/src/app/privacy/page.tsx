"use client";
import { useState } from "react";

export default function Privacy() {
  const [activeSection, setActiveSection] = useState("introduction");

  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "information", title: "Information We Collect" },
    { id: "usage", title: "How We Use Information" },
    { id: "sharing", title: "Sharing of Information" },
    { id: "cookies", title: "Cookies and Tracking" },
    { id: "security", title: "Data Storage and Security" },
    { id: "rights", title: "User Rights" },
    { id: "children", title: "Children's Privacy" },
    { id: "changes", title: "Changes to Privacy Policy" },
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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          <p className="text-sm text-gray-500 mt-4">Last updated: January 2025</p>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Table of Contents</h3>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
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

          <div className="flex-1 space-y-8">
            <section id="introduction" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">1</span>
                Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy explains how EduFlex collects, uses, and protects your personal information when you use our platform.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using EduFlex, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section id="information" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">2</span>
                Information We Collect
              </h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <strong className="text-gray-900">Personal Information:</strong>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">Name and email address</p>
                    </div>
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">Payment details and billing information</p>
                    </div>
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">Account credentials and profile information</p>
                    </div>
                  </div>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-gray-900">Non-Personal Information:</strong>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">Browser type and device information</p>
                    </div>
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">IP address and location data</p>
                    </div>
                    <div className="flex items-start space-x-3 cursor-pointer">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">Usage statistics and platform interactions</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="usage" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">3</span>
                How We Use Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">We use your information to:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Provide and improve our educational services</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Process payments and manage subscriptions</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Communicate updates, offers, and customer support</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Enforce our terms of service and prevent misuse</p>
                </div>
              </div>
            </section>

            <section id="sharing" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">4</span>
                Sharing of Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">We may share your information:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">With trusted service providers (payment processors, hosting services)</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">When required by law or legal proceedings</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">We never sell your personal information to third parties for marketing</p>
                </div>
              </div>
            </section>

            <section id="cookies" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">5</span>
                Cookies and Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, and provide personalized content.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You can disable cookies through your browser settings, though this may affect some platform functionality.
              </p>
            </section>

            <section id="security" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">6</span>
                Data Storage and Security
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Your data is stored on secure servers with industry-standard protection measures:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">End-to-end encryption for sensitive data</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Regular security audits and monitoring</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Restricted access controls and authentication</p>
                </div>
              </div>
            </section>

            <section id="rights" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">7</span>
                User Rights
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">You have the right to:</p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Access and review your personal data</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Update or correct inaccurate information</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Request deletion of your account and data</p>
                </div>
              </div>
            </section>

            <section id="children" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">8</span>
                Children's Privacy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                EduFlex is intended for users aged 18 and above. Users under 18 require parental consent to create an account.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We do not knowingly collect personal information from children under 13 without parental consent.
              </p>
            </section>

            <section id="changes" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">9</span>
                Changes to Privacy Policy
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated effective date.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We will notify users of significant changes via email or platform notifications.
              </p>
            </section>

            <section id="contact" className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4">10</span>
                Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For privacy-related questions or concerns, please contact us:
              </p>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Email: privacy@eduflex.com</p>
                </div>
                <div className="flex items-start space-x-3 cursor-pointer">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-gray-700 leading-relaxed">Privacy Contact Form: Available on our website</p>
                </div>
              </div>
            </section>
          </div>
        </div>
        
        <div className="mt-16 bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <p className="text-gray-700 leading-relaxed">
            By using EduFlex, you acknowledge that you have read and understood this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}