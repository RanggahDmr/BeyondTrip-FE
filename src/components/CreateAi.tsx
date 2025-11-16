/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Props = { isOpen: boolean; onClose: () => void; };

function splitSections(text: string) {
  const sections = text.split(/\n(?=\d+\.)/g);
  const result: { title: string; content: string }[] = [];
  for (const section of sections) {
    const [titleLine, ...bodyLines] = section.trim().split("\n");
    if (!titleLine) continue;
    result.push({ title: titleLine.replace(/^\d+\.\s*/, ""), content: bodyLines.join("\n").trim() });
  }
  return result;
}

export default function CreateAi({ isOpen, onClose }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [transport, setTransport] = useState("car");
  const [result, setResult] = useState("");

  // ⬅️ NEW: state untuk vision
  const [destImageFile, setDestImageFile] = useState<File | null>(null);
  const [destImagePreview, setDestImagePreview] = useState<string | null>(null);
  const [guessing, setGuessing] = useState(false);
  const [guess, setGuess] = useState<null | {
    name: string | null;
    city: string | null;
    region: string | null;
    country: string | null;
    coordinates?: { lat: number | null; lng: number | null };
    confidence?: number;
    explanation?: string;
  }>(null);

  useEffect(() => {
    if (!isOpen) return;
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) router.push("/login");
      else setUser(user);
    };
    fetchUser();
  }, [router, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please login first"); return; }

      const res = await api.post(
        "/api/generate-route",
        { origin, destination, transport },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      setResult(res.data.route);
      toast.success("Trip generated successfully ✨");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate route ❌");
    } finally {
      setLoading(false);
    }
  };

  // ⬅️ NEW: upload + preview
  const onPickDestImage = (file?: File | null) => {
    if (!file) { setDestImageFile(null); setDestImagePreview(null); return; }
    setDestImageFile(file);
    const url = URL.createObjectURL(file);
    setDestImagePreview(url);
  };

  // ⬅️ NEW: panggil /api/guess-destination
  const handleGuessFromImage = async () => {
    try {
      if (!destImageFile) { toast.error("Upload a destination photo first"); return; }

      setGuessing(true);
      toast.loading("Detecting location from image...");

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Please login first"); return; }

      const fd = new FormData();
      fd.append("image", destImageFile);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/guess-destination`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: fd,
      });

      toast.dismiss();
      const payload = await res.json();

      if (!res.ok) {
        console.error(payload);
        toast.error(payload?.message || "Failed to detect location");
        return;
      }

      const g = payload.guess || null;
      setGuess(g);

      // Auto-isi destination kalau ada name/city
      const auto =
        [g?.name, g?.city, g?.region, g?.country].filter(Boolean).join(", ");
      if (auto) setDestination(auto);

      toast.success(
        g?.name ? `Detected: ${g.name}${g.city ? ", " + g.city : ""}` : "Detected — review the suggestion"
      );
    } catch (e) {
      console.error(e);
      toast.dismiss();
      toast.error("Failed to detect location ❌");
    } finally {
      setGuessing(false);
    }
  };

  const sections = result ? splitSections(result) : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="bg-[#0b0b0f] text-white p-6 rounded-2xl border border-white/20 w-full max-w-2xl relative shadow-xl overflow-y-auto max-h-[85vh]"
          >
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-white">
              ✕
            </button>

            <h1 className="text-3xl font-bold mb-6 text-center">Generate AI Travel Route</h1>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white/10 p-6 rounded-2xl backdrop-blur-md w-full space-y-4 border border-white/20">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm">Origin</label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-gray-500 focus:outline-none"
                    placeholder="e.g. Jakarta"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm">Destination</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/10 border border-gray-500 focus:outline-none"
                    placeholder="e.g. Ancol / Gunung Merbabu"
                    required
                  />

                  
               
                
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm">Transport</label>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-gray-500"
                >
                  <option className="text-black" value="mobil">Mobil</option>
                  <option className="text-black" value="kereta">Kereta api</option>
                  <option className="text-black" value="pesawat">Pesawat</option>
                  <option className="text-black" value="tanpa kendaraan">Transportasi umum</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50">
                {loading ? "Generating..." : "Generate Route"}
              </button>
            </form>

            {/* Hasil AI Langsung dalam Card */}
            {sections.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 space-y-4">
                {sections.map((sec, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4"
                  >
                    <h3 className="text-lg font-semibold text-blue-300 mb-2">{sec.title}</h3>
                    <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-sans">{sec.content}</pre>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
