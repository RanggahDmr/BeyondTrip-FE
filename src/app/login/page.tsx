"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notif, setNotif] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotif(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setNotif({ type: "error", message: error.message || "Login failed. Please try again." });
    } else {
      setNotif({ type: "success", message: "Login successful! Redirecting..." });
      setTimeout(() => router.push("/dashboard"), 1500);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex font-jakarta bg-[#0b0b0f] text-white overflow-hidden">
      {/* Kiri - background image */}
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
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">Beyond<span className="text-blue-500">Trip</span> </h1>
          <p className="text-gray-300 mt-3 max-w-sm mx-auto drop-shadow-md">
            Discover smarter routes powered by AI.
          </p>
        </motion.div>
      </div>

      {/* Kanan */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 md:px-16 bg-[#0b0b0f] text-white relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-[#1a1a1f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-lg transition"
        >
          <h1 className="text-3xl font-bold mb-2 text-center">Welcome Back</h1>
          <p className="text-gray-400 mb-6 text-center">Sign in to continue your journey</p>

          {/*  Notification */}
          <AnimatePresence>
            {notif && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-4 text-sm text-center rounded-md py-2 ${
                  notif.type === "success"
                    ? "bg-green-500/20 text-green-400 border border-green-400/30"
                    : "bg-red-500/20 text-red-400 border border-red-400/30"
                }`}
              >
                {notif.message}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-500 text-white rounded-md py-2 font-semibold hover:bg-blue-600 transition ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            New to BeyondTrip?{" "}
            <Link href="/register" className="text-blue-400 font-medium hover:text-blue-300">
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
