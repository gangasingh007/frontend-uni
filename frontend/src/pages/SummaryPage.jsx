// pages/SummaryPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle, ArrowLeft, FileText } from "lucide-react";
import ApiResponseViewer from "../components/ApiResponseViewer";
import DocumentPreview from "../components/DocumentPreview";

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

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

  const resourceId = searchParams.get("resourceId");
  const classId = searchParams.get("classId");
  const subjectId = searchParams.get("subjectId");
  const linkFromUrl = searchParams.get("link");

  const [summary, setSummary] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceLink, setResourceLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (linkFromUrl) {
      const decodedLink = decodeURIComponent(linkFromUrl);
      setResourceLink(decodedLink);
    }
  }, [linkFromUrl]);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

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
            signal: controller.signal,
          }
        );

  

        setSummary(response.data.summary);

        if (response.data.resource) {
          setResourceTitle(response.data.resource.title || "");
          if (!resourceLink && response.data.resource.link) {
            setResourceLink(response.data.resource.link);
            
          }
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        const errorMessage =
          err.response?.data?.message || "An unexpected error occurred while generating the summary.";
        setError(errorMessage);
        console.error("Error fetching summary:", err);
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
  }, [resourceId, classId, subjectId]);

  const handleOpenPreview = () => {
    setShowPreview(true);
  };

  return (
    <div className="bg-black/30 min-h-screen w-full relative text-gray-200 font-sans flex flex-col">
      <div className="absolute inset-0 -z-10 h-full w-full">{/* <InteractiveBackground /> */}</div>

      {/* Header Section */}
      <div className="relative z-10 bg-black/30 backdrop-blur-sm border-b border-purple-500/20 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl pb-1 font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 bg-clip-text text-transparent mb-2">
                AI-Generated Summary
              </h1>
              {resourceTitle && (
                <p className="text-purple-300/90 text-sm italic max-w-2xl">For: "{resourceTitle}"</p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!loading && summary && resourceLink && (
                <motion.button
                  onClick={handleOpenPreview}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 border border-purple-400/30"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">View Original File</span>
                  <span className="sm:hidden">View File</span>
                </motion.button>
              )}

              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white p-3 rounded-full transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black/20 backdrop-blur-sm"
                aria-label="Go back"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content + Slide-in Preview */}
      <div className="flex flex-grow flex-col md:flex-row overflow-hidden transition-all">
  {/* Summary Section */}
  <div
    className={`flex-1 overflow-auto bg-gradient-to-b from-black/30 via-gray-900/50 to-black/20 transition-all duration-300
      ${showPreview ? "md:max-w-[75vw]" : "max-w-full"}`}
  >
    {/* Loading */}
    {loading && (
      <div className="flex-1 flex items-center justify-center h-full py-10 px-4">
        <div className="text-center">
          <div className="relative flex items-center justify-center mb-6">
            <motion.div
              className="absolute h-16 w-16 bg-purple-500/30 rounded-full animate-ping"
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1.1, opacity: 0.9 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
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
          <p className="text-gray-400 mt-3 text-xs sm:text-sm">
            AI is thinking... this may take a moment.
          </p>
        </div>
      </div>
    )}
    {/* Summary Content */}
    {!loading && summary && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative overflow-auto px-6 py-6 rounded-2xl bg-black/15 shadow-xl mt-4 mx-auto max-w-5xl"
      >
        <ApiResponseViewer text={summary} />
      </motion.div>
    )}
  </div>
  {/* Preview Side Pane, stacks below on small screens */}
  {showPreview && resourceLink && (
    <div className="w-full md:w-[80vw] max-w-[800px] min-w-[320px]">
      <DocumentPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        resourceLink={resourceLink}
      />
    </div>
  )}
  </div>
    </div>
  );
};

export default SummaryPage;
