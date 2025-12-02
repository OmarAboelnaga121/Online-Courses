"use client"

import { apiService } from "@/services/api";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCommentAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

export default function Contact() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("");
        setError("");

        if (!name || !email || !message) {
            setError("Please fill all fields");
            return;
        }

        if (message.length < 8) {
            setError("Message should be at least 8 characters long");
            return;
        }

        if (email.length < 10) {
            setError("Email Is Not Valid");
            return;
        }

        const contactBody = { name, email, message };

        try {
            setStatus("Sending...");
            await apiService.contact(contactBody);
            setStatus("Message sent successfully!");
            setName("");
            setEmail("");
            setMessage("");
        } catch {
            setStatus("Failed to send message. Please try again.");
        }
    }

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-900 mb-6 tracking-tight">Contact Us</h2>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">We would love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.</p>
                </div>

                <div className="max-w-xl mx-auto space-y-8">
                    {status && <p className="p-4 rounded-lg text-sm bg-blue-50 text-blue-700 border-l-4 border-blue-500">{status}</p>}
                    {error && <p className="p-4 rounded-lg text-sm bg-red-50 text-red-700 border-l-4 border-red-500">{error}</p>}

                    <div className="group relative">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FontAwesomeIcon icon={faUser} className="mr-2 text-blue-600" />
                            Your Name
                        </h3>
                        <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Your name" className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors duration-300" />
                    </div>

                    <div className="group relative">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2 text-blue-600" />
                            Your Email
                        </h3>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors duration-300" />
                    </div>

                    <div className="group relative">
                        <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <FontAwesomeIcon icon={faCommentAlt} className="mr-2 text-blue-600" />
                            Your Message
                        </h3>
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" className="w-full bg-transparent border-b-2 border-gray-200 py-3 text-lg text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none transition-colors duration-300 min-h-[120px] resize-none"></textarea>
                    </div>

                    <div className="pt-4">
                        <button onClick={handleSubmit} className="primaryBtn">
                            <span className="mr-2">Send Message</span>
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}