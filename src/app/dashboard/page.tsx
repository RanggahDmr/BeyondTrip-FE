/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import CreateAi from "@/components/CreateAi";
import GenerateImageModal from "@/components/GenerateImageModal";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  function splitSections(text: string) {
    const sections = text.split(/\n(?=\d+\.)/g);
    const result: { title: string; content: string }[] = [];

    for (const section of sections) {
      const [titleLine, ...bodyLines] = section.trim().split("\n");
      if (!titleLine) continue;
      result.push({
        title: titleLine.replace(/^\d+\.\s*/, ""),
        content: bodyLines.join("\n").trim(),
      });
    }
    return result;
  }

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      try {
        const res = await api.get("/api/trips", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        setTrips(res.data.trips || []);
      } catch (err) {
        console.error("Error fetching trip history:", err);
        toast.error("Failed to load trip history");
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  //OPTIMISTIC UPDATE TRIP BARU DARI CREATE AI
  const handleTripCreated = (newTrip: any) => {
    if (!newTrip) return;
    setTrips((prev) => [newTrip, ...prev])
  }

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully!");
    router.push("/login");
  };

  // Delete trip
  const handleDeleteTrip = async (id: string) => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      toast.error("Please login first");
      return;
    }

    toast.promise(
      api.delete(`/api/trips/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      }),
      {
        loading: "Deleting trip...",
        success: "Trip deleted successfully",
        error: "Failed to delete trip",
      }
    ).then(() => {
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0b0f] text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] text-white font-jakarta flex flex-col">
      {/* Navbar */}
      <header className="w-full border-b border-white/10 backdrop-blur-md bg-[#0b0b0f]/70 flex items-center justify-between px-8 py-4">
        <h1 className="text-2xl font-bold tracking-wide">🌌 BeyondTrip</h1>
        <div className="flex items-center gap-4">
          
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-md font-semibold text-sm transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center text-center px-6 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Welcome back,{" "}
          <span className="text-blue-400">
            Ranggah Rajasa
          </span>
          !
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-400 max-w-xl mx-auto mb-8"
        >
          Plan your next adventure effortlessly.  
          Generate smart routes powered by AI — tailored to your preferences.
        </motion.p>

        {/* Tombol Create Trip & Generate Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-semibold transition"
            onClick={() => setIsOpen(true)}
          >
            + Create New Trip
          </button>

          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-semibold transition"
            onClick={() => setImageModalOpen(true)}
          >
             Generate Image
          </button>

          {/* Modals */}
          <CreateAi isOpen={isOpen} onClose={() => setIsOpen(false)} onTripCreated={handleTripCreated}/>
          <GenerateImageModal
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />
        </motion.div>
      </section>

      {/* Trip History Section */}
      <section className="px-8 pb-16">
        <h3 className="text-xl font-semibold mb-6 border-b border-white/10 pb-2">
           Your Trip History
        </h3>

        {trips.length === 0 ? (
          <p className="text-gray-500 text-sm">
            You havent generated any trips yet.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, idx) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, duration: 0.5 }}
                onClick={() => setSelectedTrip(trip)}
                className="group relative cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-6 transition backdrop-blur-md text-left"
              >
                {/* Tombol Delete */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTrip(trip.id);
                  }}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-red-500"
                  title="Delete trip"
                >
                  X
                </button>

                <h4 className="text-lg font-semibold text-blue-400 mb-2">
                  {trip.origin} → {trip.destination}
                </h4>
                <p className="text-gray-400 text-sm mb-2">
                  {trip.transport} •{" "}
                  {new Date(trip.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p className="text-gray-300 text-sm line-clamp-6 whitespace-pre-wrap">
                  {trip.route_text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Trip Detail Popup */}
      <AnimatePresence>
        {selectedTrip && (
          <motion.div
            key="trip-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0b0b0f] text-white p-6 rounded-2xl border border-white/10 w-full max-w-3xl relative shadow-xl overflow-y-auto max-h-[80vh]"
            >
              <button
                onClick={() => setSelectedTrip(null)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-lg"
              >
                ✕
              </button>

              <h2 className="text-2xl font-semibold text-blue-400 mb-4">
                {selectedTrip.origin} → {selectedTrip.destination}
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                {selectedTrip.transport} •{" "}
                {new Date(selectedTrip.created_at).toLocaleString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="space-y-6">
                {splitSections(selectedTrip.route_text).map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">
                      {section.title}
                    </h3>
                    <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-sans">
                      {section.content}
                    </pre>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTrip.route_text);
                    toast.success("Trip copied to clipboard 📋");
                  }}
                  className="bg-white/10 hover:bg-white/20 text-gray-300 px-4 py-2 rounded-md text-sm transition"
                >
                  📋 Copy All
                </button>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm border-t border-white/10">
        © {new Date().getFullYear()} BeyondTrip — All Rights Reserved.
      </footer>
    </main>
  );
}
