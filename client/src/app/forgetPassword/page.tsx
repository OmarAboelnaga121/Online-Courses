"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
    const [emailBody, setEmailBody] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError("")
        console.log("Reset password for:", emailBody);

        try {
            const response = await apiService.forgetPassword({email: emailBody});
            console.log("Response:", response);
            router.push("/forgetPassword/confirmPassword");
        } catch {
            // setError(error.message || "Failed to send reset link. Please try again.");
            alert("Failed to send reset link. Please try again.");
        }
    };

    return (
        <div className="flex justify-between items-center min-h-[calc(100vh-100px)]">
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md px-4">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Forgot Password?</h1>
                    <p className="text-gray-600 mb-8">Enter your email to reset your password.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <div>
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="input"
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="primaryBtn w-full"
                        >
                            Send Reset Link
                        </button>

                        <div className="text-center mt-4">
                            <Link href="/login" className="text-sm text-[#248CF2] hover:underline font-medium">
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex-1 flex justify-center">
                <Image src="/login.png" alt="Forgot Password Illustration" width={500} height={500} />
            </div>
        </div>
    );
}