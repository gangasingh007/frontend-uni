import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Sparkles } from 'lucide-react';

// Enhanced Information Modal Component
const Information = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with animated gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-black/80 via-purple-900/20 to-blue-900/20 backdrop-blur-xl"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15), transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2), transparent 50%),
            linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.9) 100%)
          `
        }}
        onClick={onClose}
      />
      
      {/* Modal container with enhanced styling */}
      <div 
        className={`relative bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/10 overflow-hidden transform transition-all duration-500 ease-out ${
          mounted ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        }`}
        style={{
          boxShadow: `
            0 25px 50px -12px rgba(0, 0, 0, 0.8),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full blur-xl animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl animate-pulse delay-1000" />
        </div>

        {/* Content container */}
        <div className="relative p-8">
          {/* Header section */}
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-sm animate-ping" />
                <div className="relative bg-gradient-to-br from-yellow-400 to-amber-500 p-2 rounded-full">
                  <AlertCircle className="text-black" size={24} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                  Important Notice
                </h2>
                <p className="text-sm text-gray-400 mt-1">Feature Update Information</p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="relative group p-2 rounded-full transition-all duration-300 hover:bg-white/10 hover:rotate-90"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
              <X className="relative text-gray-400 group-hover:text-white transition-colors duration-300" size={24} />
            </button>
          </div>
          
          {/* Content section */}
          <div className="space-y-6">
            {/* Main message */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-purple-500/30">
                <Sparkles className="text-purple-400" size={16} />
                <span className="text-lg font-semibold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                  AI Summarization Feature Update
                </span>
              </div>
            </div>

            {/* Warning section */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2 animate-pulse" />
                <div className="text-yellow-100 space-y-2">
                  <p className="font-medium">
                    Current Limitation
                  </p>
                  <p className="text-sm text-yellow-200/80">
                    AI summarization is currently not available for handwritten notes or scanned documents.
                  </p>
                </div>
              </div>
            </div>

            {/* Info section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-400 rounded-full mt-2" />
                <div className="text-blue-100 space-y-2">
                  <p className="font-medium">
                    What Works Best
                  </p>
                  <p className="text-sm text-blue-200/80">
                    Currently optimized for digital text-based PDFs and documents. We're working hard to expand support for all document types.
                  </p>
                </div>
              </div>
            </div>

            {/* Appreciation message */}
            <div className="text-center text-gray-300">
              <p className="text-sm">
                Thank you for your patience as we enhance this feature to serve you better.
              </p>
            </div>
          </div>
          
          {/* Action button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={onClose}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-semibold rounded-2xl shadow-lg transition-all duration-500 hover:shadow-purple-500/30 hover:shadow-2xl hover:scale-105 active:scale-95"
              style={{ backgroundSize: '200% 100%' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative flex items-center gap-2">
                Got it!
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;