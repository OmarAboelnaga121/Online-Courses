"use client"

import { apiService } from "@/services/api";
import { useState } from "react";

export default function Contact() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        setStatus("");
        setError("");
        
        if (!name || !email || !message) {
            setError("Please fill all fields");
            return;
        }

        if(message.length < 8) {
            setError("Message should be at least 8 characters long");
            return;
        }

        if(email.length < 10) {
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
        } catch (error) {
            setStatus("Failed to send message. Please try again.");
        }
    }

    return(
        <div className="mx-10">
            <h2 className="text-3xl font-bold text-gray-800 ">Contact Us</h2>
            <p className="text-md text-gray-400">We would love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.</p>
            <div className="mt-6 space-y-4">
                {status && <p className="mt-2 text-sm bg-blue-100 text-blue-800 px-4 py-2 rounded-lg border border-blue-200 max-w-lg">{status}</p>}
                {error && <p className="mt-2 text-sm bg-red-100 text-red-600 px-4 py-2 rounded-lg border border-red-200 max-w-lg">{error}</p>}
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Your Name</h3>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="name" placeholder="Your name" className="input w-full max-w-lg" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Your Email</h3>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your email address" className="input w-full max-w-lg" />
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">Your Message</h3>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" className="input w-full max-w-lg h-32"></textarea>
                </div>
                <div>
                    <button onClick={handleSubmit} className="primaryBtn">Send Message</button>
                </div>
            </div>
        </div> 
    )
}