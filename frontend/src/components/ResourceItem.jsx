import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Youtube, Clock, Sparkles, Eye, DownloadCloud, ExternalLink } from 'lucide-react';

const ResourceItem = ({ classId, subjectId, resource, onSummarize }) => {
    const isDoc = resource.type === 'Document';
    const viewUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_inline/') : resource.link;
    const downloadUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_attachment/') : null;
  
    const handleSummarizeClick = (e) => {
      e.stopPropagation();
      // Pass classId, subjectId, resourceId, and resourceLink in the expected order
      onSummarize(classId, subjectId, resource._id, resource.link);
  }
  
    return (
      <motion.div 
        className="flex justify-between items-center text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-300 group p-3 rounded-xl border border-transparent hover:border-white/10"
        whileHover={{ scale: 1.02, x: 5 }}
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <motion.div
            className={`p-2 rounded-lg ${isDoc 
              ? 'bg-cyan-500/10 border border-cyan-500/20' 
              : 'bg-red-500/10 border border-red-500/20'
            }`}
            whileHover={{ scale: 1.1 }}
          >
            {isDoc ? (
              <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0" />
            ) : (
              <Youtube className="w-5 h-5 text-red-400 flex-shrink-0" />
            )}
          </motion.div>
          <div className="flex-1 overflow-hidden">
            <span className="block truncate font-medium" title={resource.title}>
              {resource.title}
            </span>
            <span className="text-xs text-gray-500 block mt-1">
              {isDoc ? 'PDF Document' : 'Video Link'} • <Clock className="w-3 h-3 inline mr-1" />Added recently
            </span>
          </div>
        </div>
  
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
          {isDoc ? (
            <>
              <motion.button
                onClick={handleSummarizeClick}
                className="p-2 hover:bg-purple-500/20 rounded-full text-purple-400 hover:text-purple-300 border border-transparent hover:border-purple-500/30 transition-all duration-200"
                title="AI Summarize"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles size={16} />
              </motion.button>
              <motion.a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-blue-500/20 rounded-full text-blue-400 hover:text-blue-300 border border-transparent hover:border-blue-500/30 transition-all duration-200"
                title="View Document"
                whileHover={{ scale: 1.1 }}
              >
                <Eye size={16} />
              </motion.a>
              {downloadUrl && (
                <motion.a
                  href={downloadUrl}
                  download
                  className="p-2 hover:bg-green-500/20 rounded-full text-green-400 hover:text-green-300 border border-transparent hover:border-green-500/30 transition-all duration-200"
                  title="Download"
                  whileHover={{ scale: 1.1 }}
                >
                  <DownloadCloud size={16} />
                </motion.a>
              )}
            </>
          ) : (
            <motion.a
              href={viewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-red-500/20 rounded-full text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 transition-all duration-200"
              title="Open Video"
              whileHover={{ scale: 1.1 }}
            >
              <ExternalLink size={16} />
            </motion.a>
          )}
        </div>
      </motion.div>
    );
  };

export default ResourceItem;