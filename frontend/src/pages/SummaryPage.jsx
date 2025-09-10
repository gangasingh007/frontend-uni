import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
// Import AnimatePresence for smooth transitions between loading texts
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import InteractiveBackground from "../components/InteractiveBackground";

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// --- NEW: Array of dynamic loading messages ---
const loadingTexts = [
  "Analyzing the document structure...",
  "Extracting key topics and text...",
  "Generating a coherent summary...",
  "Polishing the final result...",
];

const SummaryPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const resourceId = searchParams.get("resourceId");
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  
  const [summary, setSummary] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- NEW: State to track the current loading text ---
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // --- NEW: useEffect to cycle through loading texts ---
  useEffect(() => {
    let interval;
    if (loading) {
      // Set an interval to change the text every 2.5 seconds
      interval = setInterval(() => {
        setLoadingTextIndex((prevIndex) => {
          // Loop back to the start if at the end of the array
          return (prevIndex + 1) % loadingTexts.length;
        });
      }, 2500);
    }
    // Cleanup the interval when the component unmounts or loading is finished
    return () => clearInterval(interval);
  }, [loading]); // This effect runs only when the `loading` state changes


  useEffect(() => {
    if (!isValidMongoId(resourceId) || !isValidMongoId(classId) || !isValidMongoId(subjectId)) {
      setError("Invalid or missing information. Please go back and try again.");
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/resource/gemini-summarize/${classId}/${subjectId}/${resourceId}`,
          { headers: { authorization: `Bearer ${token}` } }
        );
        
        setSummary(response.data.summary);
        if (response.data.resource) {
            setResourceTitle(response.data.resource.title);
        }

      } catch (err) {
        const errorMessage = err.response?.data?.message || "Could not generate summary.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [resourceId, classId, subjectId]);

  return (
    <div className="min-h-screen w-full relative text-gray-200 font-sans">
      <div className="absolute inset-0 -z-10 h-full w-full"><InteractiveBackground /></div>
      <Navbar />
      <main className="relative z-10 flex min-h-screen items-center justify-center py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="bg-gray-900/40 from-gray-900/60 to-black/40 border border-purple-400/20 rounded-3xl shadow-2xl shadow-purple-700/25 max-w-3xl w-full p-10 backdrop-blur-xl"
        >
          <div className="flex justify-between items-start mb-6 pb-5 border-b border-white/10">
            <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                    AI-Generated Summary
                </h2>
                {resourceTitle && <p className="text-purple-300/90 text-sm italic">For resource: "{resourceTitle}"</p>}
            </div>
            <motion.button 
              onClick={() => navigate(-1)}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-400 hover:text-white p-2 rounded-full transition-colors duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Close"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* --- MODIFIED: Updated Loading State with Dynamic Text --- */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-16 text-center">
              <Loader2 className="animate-spin text-purple-400 mb-5" size={48} />
              {/* This container ensures the text area has a fixed height to prevent layout shifts */}
              <div className="h-14 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingTexts[loadingTextIndex]} // The key is crucial for AnimatePresence
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                    className="text-purple-300 text-xl font-semibold tracking-wide"
                  >
                    {loadingTexts[loadingTextIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
              <p className="text-gray-500 mt-2 text-sm">This may take a moment. Please wait.</p>
            </div>
          )}

          {error && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center my-12 text-center text-red-300 bg-red-900/40 p-6 rounded-2xl border border-red-500/50"
            >
                <AlertCircle size={40} className="mb-4 text-red-400" />
                <p className="font-bold text-xl text-red-300">Analysis Failed</p>
                <p className="text-red-300/80 mt-2 max-w-md">{error}</p>
            </motion.div>
          )}

          {summary && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-3
                         prose-p:text-gray-300 prose-strong:text-pink-300 prose-headings:text-purple-300 prose-headings:border-b prose-headings:border-purple-400/30 prose-headings:pb-2
                         scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/50 hover:scrollbar-thumb-purple-500"
            >
              {summary}
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SummaryPage;