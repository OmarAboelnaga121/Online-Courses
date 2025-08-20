"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  const sendData = async(e : React.FormEvent) => {
    e.preventDefault();
    
    try {

      if(email === "" || password === ""){
        setErrors(["Email and password are required"]);
        return;
      }
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        const errorMessages = Array.isArray(data.message) ? data.message : [data.message || "Login failed"];
        setErrors(errorMessages);
        return;
      }
      
      setErrors([]);
      router.push("/courses");
    } catch (error) {
      setErrors(["Network error. Please try again."]);
    }
  };  

  return (
    <div className="flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Welcome Back</h1>
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <ul className="text-red-600 text-sm space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <form className="space-y-6" onSubmit={sendData}>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="input"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  className="input"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="primaryBtn w-full"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/login.png" alt="Logo" width={500} height={500} />
        </div>
    </div>
  );
}
