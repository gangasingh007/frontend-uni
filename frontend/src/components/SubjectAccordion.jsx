import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';
import ResourceItem from './ResourceItem';


const SubjectAccordion = ({ classData, subjectData, expandedItems, onToggle, onSummarize }) => {
    const isExpanded = !!expandedItems[subjectData._id];
    const docCount = subjectData?.resources?.filter(r => r?.type === 'Document').length || 0;
    const ytCount = subjectData?.resources?.filter(r => r?.type === 'Yt-Link').length || 0;
  
    if (!subjectData?.resources?.length) return null;
  
    return (
      <motion.div 
        className="bg-gradient-to-r from-purple-500/5 to-transparent border border-purple-500/10 rounded-xl overflow-hidden hover:border-purple-500/20 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
      >
        <button 
          onClick={() => onToggle(subjectData._id)} 
          className="w-full flex justify-between items-center p-4 text-left text-base font-medium text-gray-200 hover:text-white hover:bg-white/5 transition-all duration-300 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30"
              whileHover={{ scale: 1.1 }}
            >
              <BookOpen className="text-purple-400 w-5 h-5" />
            </motion.div>
            <div>
              <span className="block">{subjectData.title}</span>
              <span className="text-xs text-gray-500 block mt-1">
                {docCount + ytCount} resources available
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs">
              {ytCount > 0 && (
                <span className="bg-red-500/10 text-red-300 px-2 py-1 rounded-full border border-red-500/20">
                  {ytCount} videos
                </span>
              )}
              {docCount > 0 && (
                <span className="bg-blue-500/10 text-blue-300 px-2 py-1 rounded-full border border-blue-500/20">
                  {docCount} docs
                </span>
              )}
            </div>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown size={18} />
            </motion.div>
          </div>
        </button>
  
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pl-6 pr-4 pb-4">
                <div className="space-y-2 bg-black/20 rounded-xl p-4 border border-white/5">
                  {subjectData.resources.map((resource, index) => (
                    resource && (
                      <motion.div
                        key={resource._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <ResourceItem 
                          classId={classData._id} 
                          subjectId={subjectData._id} 
                          resource={resource} 
                          onSummarize={onSummarize} 
                        />
                      </motion.div>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

export default SubjectAccordion;