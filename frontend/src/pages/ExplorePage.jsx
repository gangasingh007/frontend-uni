import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {  
  Folder, 
  BookOpen,  
  Search, 
  FileText, 
  Youtube, 
  TrendingUp
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';
import EmptyState from '../components/EmptyState';
import ClassAccordion from '../components/ClassAccordion';

// Main Page Component
const ExplorePage = () => {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllResources = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/resource/all`, {
          headers: { authorization: `Bearer ${token}` },
        });
        setAllData(res.data.data || []);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to fetch resources.';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchAllResources();
  }, []);

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSummarize = (classId, subjectId, resourceId,resourceLink) => {
    if (!classId || !subjectId || !resourceId) {
        toast.error("Could not generate summary due to missing information.");
        return;
    }
    const encodedLink = encodeURIComponent(resourceLink)
    navigate(`/summary?resourceId=${resourceId}&classId=${classId}&subjectId=${subjectId}&link=${encodedLink}`);
  };

  const filteredData = useMemo(() => {
    const validData = Array.isArray(allData) ? allData : [];
    if (!searchTerm) return validData;
    
    const lowerCaseSearch = searchTerm.toLowerCase();
    
    return validData
      .map(classData => {
        if (!classData || !Array.isArray(classData.subject)) return null;

        const filteredSubjects = classData.subject
          .map(subject => {
            if (!subject || !Array.isArray(subject.resources)) return null;

            const filteredResources = subject.resources.filter(resource =>
              resource?.title?.toLowerCase().includes(lowerCaseSearch)
            );
            return filteredResources.length > 0 ? { ...subject, resources: filteredResources } : null;
          })
          .filter(Boolean);

        return filteredSubjects.length > 0 ? { ...classData, subject: filteredSubjects } : null;
      })
      .filter(Boolean);
  }, [allData, searchTerm]);
  
  // Effect to expand all items when a search is performed
  useEffect(() => {
    if (searchTerm) {
        const allIds = {};
        filteredData.forEach(classData => {
            allIds[classData._id] = true;
            classData.subject.forEach(subject => {
                allIds[subject._id] = true;
            });
        });
        setExpandedItems(allIds);
    }
  }, [filteredData, searchTerm]);

  // Calculate total statistics
  const totalStats = useMemo(() => {
    const stats = { classes: 0, subjects: 0, documents: 0, videos: 0 };
    allData.forEach(classData => {
      stats.classes++;
      classData.subject?.forEach(subject => {
        stats.subjects++;
        subject.resources?.forEach(resource => {
          if (resource.type === 'Document') stats.documents++;
          else if (resource.type === 'Yt-Link') stats.videos++;
        });
      });
    });
    return stats;
  }, [allData]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen w-full relative ">
      <div className="absolute inset-0 -z-10"><InteractiveBackground /></div>
      
      {/* Floating gradient orbs for enhanced background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-5"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-5"></div>
      
      <Navbar />
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 ">
        <div className="max-w-5xl mx-auto">
          {/* Enhanced Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="mb-12 text-center"
          >
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Knowledge Explorer</span>
            </div>
            
            <h1 className="text-4xl pb-2 sm:text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent leading-tight">
              Explore Resources
            </h1>
            <p className="text-xl text-gray-300 mt-4 max-w-2xl mx-auto leading-relaxed">
              Discover and access study materials from all classes and subjects with AI-powered insights.
            </p>
            <p className="flex justify-center text-center text-slate-400 font-bold border-2 border-slate-600 rounded-xl p-4 leading-relaxed mt-3 w-0.5/2">
              Stay Tuned For More Resources
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
              {[ 
                { label: 'Classes', value: totalStats.classes, icon: Folder, color: 'cyan' },
                { label: 'Subjects', value: totalStats.subjects, icon: BookOpen, color: 'purple' },
                { label: 'Documents', value: totalStats.documents, icon: FileText, color: 'blue' },
                { label: 'Videos', value: totalStats.videos, icon: Youtube, color: 'red' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300"
                >
                  <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Search and Controls */}
            <div className="space-y-4">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input 
                  type="text" 
                  placeholder="Search resources, subjects, or classes..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  className="w-full pl-12 pr-16 py-4 bg-black/30 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all duration-300 text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {filteredData.length > 0 ? (
              <motion.div 
                key="results"
                className="space-y-6" 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
              >
                {searchTerm && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-4 mb-6"
                  >
                    <p className="text-purple-300 text-center">
                      Found <span className="font-semibold">{filteredData.length}</span> results for "{searchTerm}"
                    </p>
                  </motion.div>
                )}
                
                {filteredData.map((classData, index) => (
                  <motion.div
                    key={classData._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ClassAccordion 
                      classData={classData} 
                      expandedItems={expandedItems} 
                      onToggle={toggleExpand} 
                      onSummarize={handleSummarize} 
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState searchTerm={searchTerm} />
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;