import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X, AlertCircle, ArrowLeft, FileText, Maximize2, Minimize2, Home, Search, SearchCode, Atom, BrushCleaning, CheckCheck } from "lucide-react";
import ApiResponseViewer from "../components/ApiResponseViewer";
import DocumentPreview from "../components/DocumentPreview";

const isValidMongoId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const loadingTexts = [
  { text: "Analyzing document structure...", icon: Search },
  { text: "Extracting key topics...", icon: SearchCode },
  { text: "Generating summary...", icon: Atom },
  { text: "Polishing results...", icon: BrushCleaning },
  { text: "Almost ready...", icon:CheckCheck  },
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
  const [isPreviewMaximized, setIsPreviewMaximized] = useState(false);

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

  const handleOpenPreview = useCallback(() => {
    setShowPreview(true);
  }, []);

  const handleClosePreview = useCallback(() => {
    setShowPreview(false);
    setIsPreviewMaximized(false);
  }, []);

  const togglePreviewSize = useCallback(() => {
    setIsPreviewMaximized(prev => !prev);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const handleGoHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen w-full relative text-gray-200 font-sans flex flex-col">
      {/* Animated background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100/80 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Enhanced Header */}
      <motion.div 
        className="sticky top-0 z-20 bg-black/40 backdrop-blur-md border-b border-purple-500/20 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-400/30">
                  <FileText className="text-purple-400" size={24} />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                    AI-Generated Summary
                  </h1>
                  {resourceTitle && (
                    <p className="text-purple-300/80 text-sm mt-1 truncate max-w-md">
                      {resourceTitle}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {!loading && summary && resourceLink && (
                <motion.button
                  onClick={handleOpenPreview}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/50 transition-all duration-300 border border-purple-400/30"
                >
                  <FileText size={18} />
                  <span className="hidden sm:inline">View Document</span>
                  <span className="sm:hidden">Document</span>
                </motion.button>
              )}

              <motion.button
                onClick={handleGoBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black/30 backdrop-blur-sm border border-gray-700/50"
                aria-label="Go back"
                title="Go back"
              >
                <ArrowLeft size={20} />
              </motion.button>

              <motion.button
                onClick={handleGoHome}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-400 hover:text-white rounded-xl transition-all duration-300 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-black/30 backdrop-blur-sm border border-gray-700/50"
                aria-label="Go home"
                title="Go home"
              >
                <Home size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Summary Section */}
        <div
          className={`flex-1 overflow-auto transition-all duration-500 ease-in-out ${
            showPreview && !isPreviewMaximized ? 'md:w-3/5' : 'w-full'
          } ${showPreview && isPreviewMaximized ? 'hidden md:block md:w-1/3' : ''}`}
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Loading State */}
            {loading && (
              <motion.div 
                className="flex items-center justify-center min-h-[60vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-center">
                  {/* Animated loader */}
                  <div className="relative flex items-center justify-center mb-8">
                    <motion.div
                      className="absolute h-20 w-20 rounded-full border-4 border-purple-500/30"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute h-16 w-16 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                    <Loader2 className="text-purple-400" size={32} />
                  </div>

                  {/* Animated loading text */}
                  <div className="h-20 flex flex-col items-center justify-center">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={loadingTexts[loadingTextIndex].text}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-2"
                      >
                        {/* <span className="text-4xl">{loadingTexts[loadingTextIndex].icon}</span> */}
                        <p className="text-purple-300 text-lg md:text-xl font-semibold tracking-wide">
                          {loadingTexts[loadingTextIndex].text}
                        </p>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Progress indicator */}
                  <div className="mt-8 w-64 mx-auto">
                    <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: 12,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </div>
                    <p className="text-gray-400 mt-3 text-xs sm:text-sm">
                      AI is analyzing your document...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {!loading && error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-center min-h-[60vh]"
              >
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center backdrop-blur-sm">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-red-500/20 rounded-full">
                      <AlertCircle className="text-red-400" size={48} />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-red-300 mb-3">Something Went Wrong</h3>
                  <p className="text-gray-300 mb-6">{error}</p>
                  <button
                    onClick={handleGoBack}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {/* Summary Content */}
            {!loading && summary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-black/20 backdrop-blur-sm border border-gray-700/30 rounded-2xl shadow-2xl p-6 md:p-8 lg:p-10"
              >
                <ApiResponseViewer text={summary} />
              </motion.div>
            )}
          </div>
        </div>

        {/* Document Preview Panel */}
        <AnimatePresence>
          {showPreview && resourceLink && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${
                isPreviewMaximized ? 'w-full md:w-2/3' : 'w-full md:w-2/5'
              } border-l border-gray-700/50 bg-black/30 backdrop-blur-sm flex flex-col transition-all duration-500`}
            >
              {/* Preview Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-black/40">
                <div className="flex items-center gap-3">
                  <FileText className="text-purple-400" size={20} />
                  <h3 className="text-lg font-semibold text-gray-200">Document Preview</h3>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    onClick={togglePreviewSize}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
                    aria-label={isPreviewMaximized ? "Minimize preview" : "Maximize preview"}
                    title={isPreviewMaximized ? "Minimize" : "Maximize"}
                  >
                    {isPreviewMaximized ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                  </motion.button>
                  <motion.button
                    onClick={handleClosePreview}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/10"
                    aria-label="Close preview"
                    title="Close"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Preview Content */}
              <div className="flex-1 overflow-hidden">
                <DocumentPreview
                  isOpen={showPreview}
                  onClose={handleClosePreview}
                  resourceLink={resourceLink}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .overflow-auto::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .overflow-auto::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .overflow-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.3);
        }
        .overflow-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8));
        }
      `}</style>
    </div>
  );
};

export default SummaryPage;
