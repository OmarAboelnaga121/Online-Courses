"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";


type RegisterBody = {
  name : string;
  username : string;
  email : string;
  password : string;
  role : string;
}

export default function Register() {

  const [name, setName] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);
  const role = isInstructor ? "instructor" : "student";
  const [errors, setErrors] = useState<string[]>([]);
  const route = useRouter()
  const { isLoggedIn, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    
    if(isLoggedIn === true) {
      route.push('/');
    }
  })

  const sendData = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match before form submission
    if(password !== confirmPassword){
      setErrors(["Passwords do not match"]);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", userName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    if (file) {
      formData.append("photo", file);
    }

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        const errorMessages = Array.isArray(data.message) ? data.message : [data.message || "Failed to register. Please try again."];
        setErrors(errorMessages);
        return;
      }
      setErrors([]);
      route.push("/login");
    } catch (error) {
      setErrors(["Network error. Please try again."]);
    }
  }

  return (
    <div className="flex justify-between items-center">
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Create Your Account</h1>
            {errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-red-800 font-medium mb-2">Please fix the following errors:</h3>
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
                  type="text"
                  placeholder="Full Name"
                  className="input"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="User Name"
                  className="input"
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
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
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors cursor-pointer text-center">
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <span className="text-gray-600">
                    {file ? `✅ ${file.name}` : "📁 Upload Profile Picture"}
                  </span>
                </label>
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="instructor" 
                  className="mr-2" 
                  checked={isInstructor}
                  onChange={(e) => setIsInstructor(e.target.checked)}
                />
                <label htmlFor="instructor" className="text-sm text-gray-600">
                  Register as an Instructor
                </label>
              </div>
              <input type="checkbox" id="terms" className="mr-2" required/>
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-blue-500">terms</Link> and <Link href="/privacy" className="text-blue-500">privacy policy</Link>
              </label>
              <button
                type="submit"
                className="primaryBtn w-full"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Image src="/register.png" alt="Logo" width={500} height={500} />
        </div>
    </div>
  );
}
