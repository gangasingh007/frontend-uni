import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

const slideInVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };
  

const DocumentPreview = ({ isOpen, onClose, resourceLink }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showFallback, setShowFallback] = useState(false);

  // Extract file ID and convert to correct preview link
  const convertGoogleDriveLink = (link) => {
    if (!link) return null;
    
    // Strip any query parameters (?...)
    const cleanLink = link.split('?')[0]; 
    
    // Extract file ID
    const match = cleanLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    
    return link; // if no match, return original link
  };
  

  // Generate direct download link from Google Drive file ID
  const getDownloadLink = () => {
    if (!resourceLink) return "#";
    const cleanLink = resourceLink.split('?')[0];
    const match = cleanLink.match(/\/d\/([a-zA-Z0-9_-]+)/);
    return match
      ? `https://drive.google.com/uc?export=download&id=${match[1]}`
      : resourceLink;
  };

  useEffect(() => {
    if (resourceLink) {
      const convertedUrl = convertGoogleDriveLink(resourceLink);
      setPreviewUrl(convertedUrl);
      setShowFallback(false);

      // Show fallback after 3s in case preview fails
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [resourceLink]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop, covers entire screen except preview pane */}
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sliding preview pane */}
      <motion.div
        key="slide-in-pane"
        className="fixed top-0 right-0 bottom-0 w-[40vw] min-w-[300px] max-w-[600px] bg-gray-900 border-l border-white/20 shadow-lg z-50 flex flex-col"
        variants={slideInVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="flex justify-between py-4 px-5 border-b border-white/20">
          <h2 className="text-lg font-semibold text-white">Document Preview</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded hover:bg-white/10 transition"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Iframe */}
        <div className="flex-grow">
          <iframe
            src={resourceLink} // or converted preview URL
            className="w-full h-full border-0"
            title="Document Preview"
            allow="autoplay"
          />
        </div>

        {/* Footer with download, open links if needed */}
        {/* ...optional footer */}
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentPreview;
