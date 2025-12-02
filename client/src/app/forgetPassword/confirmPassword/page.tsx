"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { apiService } from "@/services/api";
import { useRouter } from "next/navigation";

export default function ConfirmPassword() {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        console.log("Resetting password with token:", token);

        try {
            const response = await apiService.confirmPassword({ token, newPassword });
            console.log("Response:", response);
            router.push("/login");
        } catch (error: any) {
            setError(error.message || "Failed to reset password. Please try again.");
        }
    };

    return (
        <div className="flex justify-between items-center min-h-[calc(100vh-100px)]">
            <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md px-4">
                    <h1 className="text-3xl font-bold mb-2 text-gray-800">Reset Password</h1>
                    <p className="text-gray-600 mb-8">Enter the code sent to your email and your new password.</p>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}
                        <div>
                            <input
                                type="text"
                                placeholder="Reset Code"
                                className="input"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                className="input"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="primaryBtn w-full"
                        >
                            Reset Password
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
                <Image src="/login.png" alt="Reset Password Illustration" width={500} height={500} />
            </div>
        </div>
    );
}
