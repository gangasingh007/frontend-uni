import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, TrendingUp } from 'lucide-react';


const EmptyState = ({ searchTerm }) => (
    <motion.div 
      key="empty"
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="text-center py-20 bg-gradient-to-br from-black/20 to-black/10 rounded-3xl border border-dashed border-white/20 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="relative z-10"
      >
        <div className="mx-auto h-24 w-24 bg-gradient-to-br from-gray-500/10 to-gray-400/10 rounded-full flex items-center justify-center mb-6 border border-gray-500/20">
          <Wind className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-200 mb-2">
          {searchTerm ? `No results for "${searchTerm}"` : 'No Resources Found'}
        </h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">
          {searchTerm 
            ? 'Try adjusting your search terms or browse all available resources.'
            : 'It looks like there are no resources available yet. Check back later for updates.'
          }
        </p>
        {searchTerm && (
          <motion.button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 px-6 py-3 rounded-full border border-purple-500/30 hover:border-purple-500/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <TrendingUp className="w-4 h-4" />
            Browse All Resources
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );

  
export default EmptyState;