import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle } from 'lucide-react';

// Information Modal Component
const Information = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-black/80 rounded-3xl shadow-2xl max-w-md w-full p-8 border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-400" size={24} />
                <h2 className="text-2xl font-bold text-white">Important Notice</h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="text-gray-300 space-y-4">
              <p className="text-lg font-medium">
                AI Summarization Feature Update is Coming Soon
              </p>
              <p>
                Please note that AI summarization is currently not available for handwritten notes or scanned documents.
              </p>
              <p className="font-semibold text-yellow-300">
                Coming Soon: Enhanced support for scanned and handwritten content!
              </p>
              <p>
                We appreciate your understanding as we work to improve this feature. For now, it works best with digital text-based PDFs and documents.
              </p>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                Got It!
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Information