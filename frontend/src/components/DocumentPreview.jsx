import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink, LoaderCircle, AlertCircle } from "lucide-react";

const slideInVariants = {
  hidden: { x: "100%" },
  visible: { x: 0 },
  exit: { x: "100%" },
};

const DocumentPreview = ({ isOpen, onClose, resourceLink }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);

  // This function is correct for creating an embeddable link.
  // Google Drive's /view endpoint often blocks iframe embedding.
  // The /preview endpoint is designed for it.
  const convertToPreviewLink = (link) => {
    if (!link) return null;

    // Regular expression to find the Google Drive file ID
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/);

    if (match && match[1]) {
      // Construct the embeddable preview URL
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // If it's not a standard Google Drive link, return it as is
    return link;
  };

  const getDownloadLink = () => {
    if (!resourceLink) return "#";
    const match = resourceLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match && match[1]
      ? `https://drive.google.com/uc?export=download&id=${match[1]}`
      : resourceLink;
  };

  useEffect(() => {
    if (isOpen && resourceLink) {
      setIsLoading(true);
      setShowFallback(false);
      setPreviewUrl(convertToPreviewLink(resourceLink));

      // Set a timer to show a fallback message in case the iframe fails to load
      const timer = setTimeout(() => {
        setIsLoading(false);
        setShowFallback(true);
      }, 5000); // Increased timer to 5s for slower connections

      return () => clearTimeout(timer);
    }
  }, [isOpen, resourceLink]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-label="Close Preview"
            tabIndex={-1}
          />

          {/* Sliding Pane */}
          <motion.div
            key="slide-in-pane"
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[75vw] md:w-[60vw] lg:w-[800px] max-w-full bg-gray-900 border-l border-white/20 shadow-2xl z-50 flex flex-col transition-all"
            variants={slideInVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-3 px-4 border-b border-white/20">
              <h2 className="text-base sm:text-lg font-semibold text-white">Document Preview</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-full hover:bg-purple-600/20 active:bg-purple-800/30 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <X size={22} className="text-white" />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-grow relative bg-black/5">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white/70 z-10 gap-2 bg-black/40">
                  <LoaderCircle className="animate-spin h-8 w-8 mb-2" />
                  <p className="text-sm sm:text-base text-center px-4">Loading Preview...</p>
                </div>
              )}
              <iframe
                src={previewUrl}
                className={`w-full h-full min-h-[220px] border-0 transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                title="Document Preview"
                onLoad={() => {
                  setIsLoading(false);
                  setShowFallback(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setShowFallback(true);
                }}
                allowFullScreen
              />
            </div>

            {/* Footer with Actions */}
            <div className="flex items-center justify-end px-4 py-2 border-t border-white/10 bg-gray-900">
              <a
                href={getDownloadLink()}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-purple-400 hover:text-white px-3 py-1.5 rounded-xl transition bg-purple-700/10 hover:bg-purple-600/30 font-semibold text-sm"
              >
                <Download size={16} />
                Download
              </a>
              <a
                href={resourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-white px-3 py-1.5 rounded-xl ml-2 transition bg-indigo-700/10 hover:bg-indigo-600/30 font-semibold text-sm"
              >
                <ExternalLink size={16} />
                Open Externally
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default DocumentPreview;