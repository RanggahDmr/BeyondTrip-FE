"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  
  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
    } else {
      setErrorMsg("");
    }
  }, [password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert(error.message);
    } else {
      alert("Registration successful! Please check your email.");
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-jakarta bg-[#0b0b0f] text-white overflow-hidden">
      {/* Kiri - Background image + overlay */}
      <div className="hidden md:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/travel-bg.jpg')",
            opacity: 0.5,
          }}
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="z-10 text-center"
        >
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
             Beyond<span className="text-blue-500">Trip</span> 
          </h1>
          <p className="text-gray-300 mt-3 max-w-sm mx-auto drop-shadow-md">
            Start your journey — smarter and faster.
          </p>
        </motion.div>
      </div>

      {/* Kanan - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 md:px-16 bg-[#0b0b0f] text-white">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-[#1a1a1f]/80 backdrop-blur-md border border-white/10 hover:border-blue-500/30 rounded-2xl p-8 shadow-lg hover:shadow-blue-500/10 transition"
        >
          <h1 className="text-3xl font-bold mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 mb-6 text-center">
            Join BeyondTrip and start exploring smarter.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-md px-3 py-2 bg-[#2a2a2f] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-md px-3 py-2 bg-[#2a2a2f] text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                className={`w-full rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  errorMsg
                    ? "bg-[#2a2a2f] text-white focus:ring-red-500"
                    : "bg-[#2a2a2f] text-white focus:ring-blue-500"
                }`}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errorMsg && (
                <p className="text-red-500 text-sm mt-1">{errorMsg}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !!errorMsg}
              className={`w-full rounded-md py-2 font-semibold transition ${
                errorMsg
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 font-medium hover:text-blue-300"
            >
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
