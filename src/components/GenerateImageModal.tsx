"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import api from "@/lib/axios";
import toast from "react-hot-toast";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GenerateImageModal({ isOpen, onClose }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ name: string; location: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      toast.error("Please upload an image first");
      return;
    }
    setLoading(true);
    setResult(null);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please login first");
        return;
      }

      const fd = new FormData();
      fd.append("image", file);

      // panggil endpoint kamu (dummy atau real)
      const res = await api.post("/api/guess-destination", fd, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const g = res.data?.guess;
      setResult({
        name: g?.name || "Unknown",
        location:
          [g?.city, g?.region, g?.country].filter(Boolean).join(", ") ||
          "Location not found",
      });
      toast.success("AI successfully identified the place ");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate image ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0b0b0f] text-white p-6 rounded-2xl border border-white/20 w-full max-w-md relative shadow-xl"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">
               Find a Location By your image
            </h2>

            {/* Upload input */}
            <div className="flex flex-col items-center gap-3 mb-4">
              <label
                htmlFor="image"
                className="cursor-pointer bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-md text-sm"
              >
                Upload Image
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {preview && (
                <img
                  src={preview}
                  alt="preview"
                  className="rounded-md w-40 h-40 object-cover border border-white/10"
                />
              )}
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !file}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Generate"}
            </button>

            {/* Hasil AI */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-blue-300 mb-1">
                  {result.name}
                </h3>
                <p className="text-gray-300 text-sm">{result.location}</p>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
