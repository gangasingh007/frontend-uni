import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle, ArrowLeft } from "lucide-react"; // Added ArrowLeft for button
import Navbar from "../components/Navbar";
import InteractiveBackground from "../components/InteractiveBackground";
import ApiResponseViewer from "../components/ApiResponseViewer";

// A simple validator for MongoDB ObjectIDs
const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// Array of dynamic loading messages for a better UX
const loadingTexts = [
  "Analyzing document structure...",
  "Extracting key topics and concepts...",
  "Generating a coherent summary...",
  "Polishing the final result...",
  "Almost there...",
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
            signal: controller.signal // Pass signal to axios
          }
        );
        
        setSummary(response.data.summary);
        if (response.data.resource) {
          setResourceTitle(response.data.resource.title);
        }

      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
          return;
        }
        const errorMessage = err.response?.data?.message || "An unexpected error occurred while generating the summary.";
        setError(errorMessage);
      } finally {
        if (!controller.signal.aborted) {
            setLoading(false);
        }
      }
    };

    fetchSummary();

    return () => {
      controller.abort();
    };

  }, [resourceId, classId, subjectId, navigate]);

  return (
    <div className="min-h-screen w-full relative text-gray-200 font-sans overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full"><InteractiveBackground /></div>
      <Navbar />
      <main className="relative z-10 flex min-h-screen items-center justify-center py-24 px-4">
        {/* --- UI ENHANCEMENT: Added a more complex background gradient and shadow for a richer look --- */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="relative bg-black/50 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-900/40 max-w-4xl w-full p-8 md:p-12 backdrop-blur-2xl"
        >
          {/* --- UI ENHANCEMENT: Added a radial gradient for a subtle lighting effect --- */}
          <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.15),_transparent_40%)]" />
          
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                AI-Generated Summary
              </h2>
              {resourceTitle && <p className="text-purple-300/90 text-sm italic max-w-md truncate">For: "{resourceTitle}"</p>}
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
          
          <div className="mt-8 min-h-[300px] flex flex-col justify-center">
            {/* --- UI ENHANCEMENT: Improved loading state with a pulsating glow effect --- */}
            {loading && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="absolute h-16 w-16 bg-purple-500/30 rounded-full animate-ping" />
                  <Loader2 className="animate-spin text-purple-400" size={48} />
                </div>
                <div className="h-14 flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingTexts[loadingTextIndex]}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4 }}
                      className="text-purple-300 text-lg md:text-xl font-semibold tracking-wide"
                    >
                      {loadingTexts[loadingTextIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
                <p className="text-gray-500 mt-2 text-sm">AI is thinking... this may take a moment.</p>
              </div>
            )}

            {/* --- UI ENHANCEMENT: More polished error state with a clear call-to-action --- */}
            {error && !loading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center bg-red-900/30 p-8 rounded-2xl border border-red-500/50"
              >
                <AlertCircle size={40} className="mb-4 text-red-400" />
                <p className="font-bold text-xl text-red-300">An Error Occurred</p>
                <p className="text-red-300/80 mt-2 max-w-md">{error}</p>
                <motion.button
                  onClick={() => navigate(-1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-300 font-semibold rounded-lg border border-red-500/50 hover:bg-red-500/40 transition-all duration-300"
                >
                  <ArrowLeft size={18} />
                  Go Back
                </motion.button>
              </motion.div>
            )}

            {/* --- UI ENHANCEMENT: Wrapped summary in a container with an inset look for better focus --- */}
            {summary && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900/50 shadow-inner p-4 sm:p-6 rounded-xl prose prose-lg prose-invert max-w-none text-gray-300 leading-relaxed 
                           max-h-[60vh] overflow-y-auto pr-3
                           scrollbar-thin scrollbar-track-transparent scrollbar-thumb-purple-500/50 hover:scrollbar-thumb-purple-500"
              >
                <ApiResponseViewer text={summary} />
              </motion.div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default SummaryPage;