import React from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, ChevronDown } from 'lucide-react';
import SubjectAccordion from './SubjectAccordion';

const ClassAccordion = ({ classData, expandedItems, onToggle, onSummarize }) => {
    const isExpanded = !!expandedItems[classData._id];
    const className = `${classData.courseName} ${classData.section} - Sem ${classData.semester}`;
    const totalResources = classData.subject.reduce((acc, sub) => acc + (sub?.resources?.length || 0), 0);
    const docCount = classData.subject.reduce((acc, sub) => 
      acc + (sub?.resources?.filter(r => r?.type === 'Document').length || 0), 0
    );
    const videoCount = classData.subject.reduce((acc, sub) => 
      acc + (sub?.resources?.filter(r => r?.type === 'Yt-Link').length || 0), 0
    );
  
    return (
      <motion.div 
        className="group bg-gradient-to-r from-black/30 to-black/20 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300"
        whileHover={{ scale: 1.01 }}
        layout
      >
        <button 
          onClick={() => onToggle(classData._id)} 
          className="w-full flex justify-between items-center p-6 text-left text-lg font-semibold text-white hover:bg-white/5 transition-all duration-300"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30"
              whileHover={{ scale: 1.1 }}
            >
              <Folder className="text-cyan-400 w-6 h-6" />
            </motion.div>
            <div>
              <span className="block text-lg">{className}</span>
              <span className="text-sm text-gray-400 block mt-1">
                {docCount} documents • {videoCount} videos
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-300 bg-white/10 px-3 py-1 rounded-full">
                {totalResources} items
              </span>
            </div>
            <motion.div 
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="p-2 rounded-full bg-white/5 group-hover:bg-white/10"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </button>
  
        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }} 
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pl-8 pr-6 pb-6">
                <div className="border-l-2 border-gradient-to-b from-cyan-500/50 to-purple-500/50 pl-8 space-y-4">
                  {classData.subject.map((subjectData, index) => (
                    subjectData && (
                      <motion.div
                        key={subjectData._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <SubjectAccordion 
                          classData={classData} 
                          subjectData={subjectData} 
                          expandedItems={expandedItems} 
                          onToggle={onToggle} 
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

export default ClassAccordion;