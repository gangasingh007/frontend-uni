import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import InteractiveBackground from "../components/InteractiveBackground";

// A simple validator for MongoDB ObjectIDs
const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Array of dynamic loading messages for a better UX
const loadingTexts = [
  "Analyzing the document structure...",
  "Extracting key topics and text...",
  "Generating a coherent summary...",
  "Polishing the final result...",
];

const SummaryPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Get IDs from URL search parameters
  const resourceId = searchParams.get("resourceId");
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  
  // State management for summary data, loading, and errors
  const [summary, setSummary] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  // useEffect to cycle through the loading texts while loading is true
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
      }, 2500); // Change text every 2.5 seconds
    }
    // Cleanup the interval on component unmount or when loading finishes
    return () => clearInterval(interval);
  }, [loading]);

  // useEffect for fetching the summary from the backend
  useEffect(() => {
    // Validate IDs before making an API call
    if (!isValidMongoId(resourceId) || !isValidMongoId(classId) || !isValidMongoId(subjectId)) {
      setError("Invalid or missing information. Please go back and try again.");
      setLoading(false);
      return;
    }

    // Use AbortController to prevent duplicate requests
    const controller = new AbortController();

    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/resource/gemini-summarize/${classId}/${subjectId}/${resourceId}`,
          { 
            headers: { authorization: `Bearer ${token}` },
          
          }
        );
        
        setSummary(response.data.summary);
        if (response.data.resource) {
          setResourceTitle(response.data.resource.title);
        }

      } catch (err) {
        // Ignore the error if it's from the request being intentionally aborted
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        const errorMessage = err.response?.data?.message || "Could not generate summary.";
        setError(errorMessage);
      } finally {
        // Only set loading to false if the request wasn't aborted
        if (!controller.signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchSummary();

    // Cleanup function: aborts the request on unmount or re-render
    return () => {
      controller.abort();
    };

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
          
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center my-16 text-center">
              <Loader2 className="animate-spin text-purple-400 mb-5" size={48} />
              <div className="h-14 flex items-center">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingTexts[loadingTextIndex]}
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

          {/* Error State */}
          {error && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center my-12 text-center text-red-300 bg-red-900/40 p-6 rounded-2xl border border-red-500/50"
            >
              <AlertCircle size={40} className="mb-4 text-red-400" />
              <p className="font-bold text-xl text-red-300">OCR Error</p>
              <p className="text-red-300/80 mt-2 max-w-md">{error}</p>
            </motion.div>
          )}

          {/* Success State */}
          {summary && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap max-h-[60vh] overflow-y-auto pr-3
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