import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  Folder, 
  BookOpen, 
  Eye, 
  DownloadCloud, 
  ExternalLink, 
  Search, 
  FileText, 
  Youtube, 
  Wind, 
  Sparkles,
  Filter,
  Grid3X3,
  List,
  Clock,
  TrendingUp
} from 'lucide-react';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import InteractiveBackground from '../components/InteractiveBackground';

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

  const handleSummarize = (classId, subjectId, resourceId) => {
    if (!classId || !subjectId || !resourceId) {
        toast.error("Could not generate summary due to missing information.");
        return;
    }
    navigate(`/summary?resourceId=${resourceId}&classId=${classId}&subjectId=${subjectId}`);
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
      
      <main className="relative z-10 px-4 sm:px-6 lg:px-8 py-8">
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
                { label: 'Subjects', value: 5, icon: BookOpen, color: 'purple' },
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

// Enhanced Child Components

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

const ResourceItem = ({ classId, subjectId, resource, onSummarize }) => {
  const isDoc = resource.type === 'Document';
  const viewUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_inline/') : resource.link;
  const downloadUrl = isDoc && resource.link ? resource.link.replace('/upload/', '/upload/fl_attachment/') : null;

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
              onClick={() => onSummarize(classId, subjectId, resource._id)}
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

const EmptyState = ({ searchTerm }) => (
  <motion.div 
    key="empty"
    initial={{ opacity: 0, scale: 0.95 }} 
    animate={{ opacity: 1, scale: 1 }} 
    exit={{ opacity: 0, scale: 0.95 }}
    className="text-center py-20 bg-gradient-to-br from-black/20 to-black/10 rounded-3xl border border-dashed border-white/20 relative overflow-hidden"
  >
    {/* Animated background elements */}
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

export default ExplorePage;
