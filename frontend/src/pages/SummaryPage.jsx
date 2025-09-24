import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle, ArrowLeft } from "lucide-react";
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
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // useEffect for fetching the summary from the backend
  useEffect(() => {
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
            signal: controller.signal
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
    <div className="bg-black/40 min-h-screen w-full relative text-gray-200 font-sans flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full">
        {/* <InteractiveBackground /> */}
      </div>
      
      {/* Fixed Navbar */}
      <div className="relative z-20">
        {/* <Navbar /> */}
      </div>

      {/* Header Section - Fixed at top */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-purple-500/20 px-4 py-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl pb-1 font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
              AI-Generated Summary
            </h1>
            {resourceTitle && (
              <p className="text-purple-300/90 text-sm italic max-w-2xl">
                For: "{resourceTitle}"
              </p>
            )}
          </div>
          <motion.button 
            onClick={() => navigate(-1)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-400 hover:text-white p-3 rounded-full transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black/20 backdrop-blur-sm"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </motion.button>
        </div>
      </div>

      {/* Main Content - Takes full remaining height */}
      <main className="relative z-10 flex-1 flex flex-col">
        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <div className="relative flex items-center justify-center mb-6">
                <div className="absolute h-16 w-16 bg-purple-500/30 rounded-full animate-ping" />
                <Loader2 className="animate-spin text-purple-400" size={48} />
              </div>
              <div className="h-14 flex items-center justify-center">
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
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex-1 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-red-900/30 p-8 rounded-2xl border border-red-500/50 max-w-md"
            >
              <AlertCircle size={40} className="mb-4 text-red-400 mx-auto" />
              <p className="font-bold text-xl text-red-300 mb-2">An Error Occurred</p>
              <p className="text-red-300/80 mb-6">{error}</p>
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/20 text-red-300 font-semibold rounded-lg border border-red-500/50 hover:bg-red-500/40 transition-all duration-300 mx-auto"
              >
                <ArrowLeft size={18} />
                Go Back
              </motion.button>
            </motion.div>
          </div>
        )}

        {/* Summary Content - Takes full page */}
        {summary && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex-1 overflow-hidden"
          >
            <ApiResponseViewer text={summary} />
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default SummaryPage;
