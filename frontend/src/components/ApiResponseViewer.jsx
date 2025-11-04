import React, { useState, useCallback, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, ChevronDown, ChevronUp, Zap, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApiResponseViewer = ({ text, streamingMode = true, autoScroll = true }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInstant, setShowInstant] = useState(false);
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  const copyToClipboard = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

  // Helper function to ensure code blocks are properly closed
  const ensureClosedCodeBlocks = (partialText) => {
    const openFences = (partialText.match(/^```/gm) || []).length;
    if (openFences % 2 !== 0) {
      return partialText + '\n```';
    }
    return partialText;
  };

  // Auto-scroll to bottom as content appears
  useEffect(() => {
    if (autoScroll && isAnimating && containerRef.current) {
      const scrollToBottom = () => {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      };
      const scrollInterval = setInterval(scrollToBottom, 100);
      return () => clearInterval(scrollInterval);
    }
  }, [isAnimating, autoScroll]);

  // Optimized typewriter effect with chunked rendering
  useEffect(() => {
    if (text) {
      if (!streamingMode || showInstant) {
        setDisplayedText(text);
        setIsAnimating(false);
        setProgress(100);
        return;
      }

      setIsAnimating(true);
      setDisplayedText("");
      setProgress(0);
      
      let currentIndex = 0;
      const textLength = text.length;
      
      // Dynamic speed based on content length
      const baseSpeed = 1; // Base milliseconds per chunk
      const chunkSize = Math.max(1, Math.floor(textLength / 500)); // Adaptive chunk size
      
      const animate = () => {
        if (currentIndex <= textLength) {
          const nextIndex = Math.min(currentIndex + chunkSize, textLength);
          const partialText = text.slice(0, nextIndex);
          setDisplayedText(ensureClosedCodeBlocks(partialText));
          setProgress((nextIndex / textLength) * 100);
          currentIndex = nextIndex;
          
          if (currentIndex < textLength) {
            animationRef.current = requestAnimationFrame(() => {
              setTimeout(animate, baseSpeed);
            });
          } else {
            setDisplayedText(text);
            setIsAnimating(false);
            setProgress(100);
          }
        }
      };

      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setDisplayedText(text);
        setIsAnimating(false);
        setProgress(100);
      };
    } else {
      setDisplayedText("");
      setProgress(0);
    }
  }, [text, streamingMode, showInstant]);

  const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const codeIndex = `code-${Math.random().toString(36).substr(2, 9)}`;
    const [isExpanded, setIsExpanded] = useState(true);

    if (!inline) {
      const lineCount = codeString.split('\n').length;
      const isLongCode = lineCount > 15;

      return (
        <motion.div 
          className="relative group my-6"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm px-4 py-2.5 rounded-t-xl border border-slate-600/40 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"
                />
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"
                />
                <motion.span 
                  whileHover={{ scale: 1.2 }}
                  className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"
                />
              </div>
              <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
                {match ? match[1] : 'code'}
              </span>
              {isLongCode && (
                <span className="text-xs text-slate-300 bg-slate-600/50 px-2.5 py-1 rounded-full font-medium">
                  {lineCount} lines
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isLongCode && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-600/50 hover:bg-slate-600/70 rounded-lg transition-all duration-200 backdrop-blur-sm"
                  aria-label={isExpanded ? "Collapse code" : "Expand code"}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => copyToClipboard(codeString, codeIndex)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-600/50 hover:bg-slate-600/70 rounded-lg transition-all duration-200 backdrop-blur-sm"
                aria-label="Copy code to clipboard"
              >
                <AnimatePresence mode="wait">
                  {copiedCode === codeIndex ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5 text-emerald-400"
                    >
                      <Check size={14} />
                      <span>Copied!</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-1.5"
                    >
                      <Copy size={14} />
                      <span className="hidden sm:inline">Copy</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
          
          {/* Enhanced Code content */}
          <div className="bg-slate-900/95 backdrop-blur-sm rounded-b-xl overflow-hidden border-x border-b border-slate-600/40 shadow-2xl">
            <AnimatePresence initial={false}>
              <motion.pre 
                className={`p-5 overflow-x-auto text-sm leading-relaxed scrollbar-thin scrollbar-track-slate-800 scrollbar-thumb-slate-600 ${
                  !isExpanded && isLongCode ? 'max-h-72' : ''
                } transition-all duration-300`}
                initial={false}
                animate={{ 
                  maxHeight: isExpanded ? 'none' : isLongCode ? '18rem' : 'none'
                }}
              >
                <code 
                  className={`${className || ''} text-slate-100 font-mono text-[14px] tracking-wide`}
                  {...props}
                >
                  {children}
                </code>
              </motion.pre>
            </AnimatePresence>
          </div>
          
          {/* Enhanced fade overlay */}
          {!isExpanded && isLongCode && (
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent pointer-events-none rounded-b-xl flex items-end justify-center pb-4">
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="text-slate-400 text-xs font-medium"
              >
                Click expand to see more
              </motion.div>
            </div>
          )}
        </motion.div>
      );
    }

    return (
      <motion.code 
        whileHover={{ scale: 1.05 }}
        className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 px-2.5 py-1 rounded-lg text-[14px] font-mono border border-indigo-500/30 hover:border-indigo-400/50 transition-all shadow-sm" 
        {...props}
      >
        {children}
      </motion.code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const headingId = String(children).toLowerCase().replace(/\s+/g, '-');
    
    const styles = {
      1: {
        size: "text-3xl md:text-4xl lg:text-5xl font-black mb-6 mt-8",
        gradient: "from-blue-400 via-purple-400 to-pink-400",
        decoration: "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-400 before:to-purple-400 before:rounded-full"
      },
      2: {
        size: "text-2xl md:text-3xl lg:text-4xl font-bold mb-5 mt-7",
        gradient: "from-indigo-400 to-purple-400",
        decoration: "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-indigo-400 before:to-purple-400 before:rounded-full"
      },
      3: {
        size: "text-xl md:text-2xl lg:text-3xl font-bold mb-4 mt-6",
        gradient: "from-slate-100 to-slate-300",
        decoration: "before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-slate-400 before:to-slate-600 before:rounded-full"
      },
      4: {
        size: "text-lg md:text-xl lg:text-2xl font-semibold mb-3 mt-5",
        gradient: "from-slate-200 to-slate-400",
        decoration: ""
      },
      5: {
        size: "text-base md:text-lg lg:text-xl font-semibold mb-2 mt-4",
        gradient: "from-slate-300 to-slate-500",
        decoration: ""
      },
      6: {
        size: "text-sm md:text-base lg:text-lg font-medium mb-2 mt-3",
        gradient: "from-slate-400 to-slate-600",
        decoration: ""
      }
    };

    const style = styles[level];

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{ x: 5 }}
        className="group"
      >
        <Tag 
          id={headingId}
          className={`${style.size} relative pl-6 ${style.decoration} text-transparent bg-clip-text bg-gradient-to-r ${style.gradient} transition-all duration-300`}
        >
          {level <= 3 && (
            <motion.span
              className="absolute left-0 top-1/2 -translate-y-1/2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-purple-400/50" />
            </motion.span>
          )}
          {children}
        </Tag>
      </motion.div>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <motion.blockquote 
      className="relative border-l-4 border-gradient-to-b from-sky-400 to-indigo-400 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent pl-6 pr-5 py-4 my-6 italic text-slate-200 rounded-xl shadow-lg backdrop-blur-sm"
      initial={{ opacity: 0, x: -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      whileHover={{ x: 5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute -left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full opacity-20 blur-xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </motion.blockquote>
  );

  const CustomParagraph = ({ children }) => (
    <motion.p 
      className="text-slate-200 leading-relaxed mb-5 text-[16px] tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.p>
  );

  return (
    <div className="w-full relative" ref={containerRef}>
      {/* Progress bar for streaming text */}
      {isAnimating && (
        <motion.div 
          className="fixed top-0 left-0 right-0 h-1 bg-slate-800 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      )}

      {/* Speed control button */}
      {streamingMode && text && isAnimating && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInstant(true)}
          className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-full shadow-2xl backdrop-blur-sm transition-all duration-200 z-40"
        >
          <Zap size={18} />
          <span className="text-sm">Show All</span>
        </motion.button>
      )}

      <div className="max-w-none">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CustomCode,
              h1: ({ children }) => <CustomHeading level={1}>{children}</CustomHeading>,
              h2: ({ children }) => <CustomHeading level={2}>{children}</CustomHeading>,
              h3: ({ children }) => <CustomHeading level={3}>{children}</CustomHeading>,
              h4: ({ children }) => <CustomHeading level={4}>{children}</CustomHeading>,
              h5: ({ children }) => <CustomHeading level={5}>{children}</CustomHeading>,
              h6: ({ children }) => <CustomHeading level={6}>{children}</CustomHeading>,
              blockquote: CustomBlockquote,
              p: CustomParagraph,
              // ... rest of your components remain the same
              ul: ({ children }) => <CustomList ordered={false}>{children}</CustomList>,
              ol: ({ children }) => <CustomList ordered={true}>{children}</CustomList>,
              li: CustomListItem,
              table: CustomTable,
              thead: CustomTableHeader,
              tr: CustomTableRow,
              td: ({ children }) => <CustomTableCell>{children}</CustomTableCell>,
              th: ({ children }) => <CustomTableCell isHeader>{children}</CustomTableCell>,
              a: CustomLink,
              strong: CustomStrong,
              em: CustomEmphasis,
              del: CustomDelete,
              input: CustomInput,
              hr: CustomHr,
            }}
          >
            {displayedText || "# Welcome\n\n*Your AI-powered content will appear here...*"}
          </ReactMarkdown>
          
          {/* Enhanced typing cursor */}
          {isAnimating && (
            <motion.span
              className="inline-flex items-center gap-2 ml-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">
                Generating response...
              </span>
            </motion.span>
          )}
        </div>
      </div>
    </div>
  );

  // Keep existing component definitions
  function CustomList({ ordered, children }) {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-5 space-y-2.5 text-slate-200 marker:text-indigo-400`}>
        {children}
      </Component>
    );
  }

  function CustomListItem({ children, className }) {
    const isTaskList = className?.includes('task-list-item');
    return (
      <motion.li 
        className={`text-slate-200 leading-relaxed pl-2 hover:text-slate-100 transition-colors ${
          isTaskList ? 'list-none -ml-6' : ''
        }`}
        whileHover={{ x: 3 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.li>
    );
  }

  function CustomTable({ children }) {
    return (
      <div className="overflow-x-auto my-6 rounded-xl border border-slate-600/50 shadow-2xl bg-slate-800/50 backdrop-blur-sm">
        <table className="min-w-full divide-y divide-slate-700/50">
          {children}
        </table>
      </div>
    );
  }

  function CustomTableHeader({ children }) {
    return (
      <thead className="bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm">
        {children}
      </thead>
    );
  }

  function CustomTableRow({ children }) {
    return (
      <motion.tr 
        className="border-b border-slate-700/40 hover:bg-indigo-500/10 transition-colors duration-200"
        whileHover={{ scale: 1.01 }}
      >
        {children}
      </motion.tr>
    );
  }

  function CustomTableCell({ children, isHeader }) {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-6 py-4 text-left ${
        isHeader 
          ? 'font-bold text-slate-100 text-sm tracking-wider uppercase' 
          : 'text-slate-200 text-sm'
      }`}>
        {children}
      </Component>
    );
  }

  function CustomLink({ href, children }) {
    return (
      <motion.a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 hover:from-indigo-300 hover:to-purple-300 font-semibold underline decoration-indigo-400/30 hover:decoration-indigo-300/60 underline-offset-4 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.a>
    );
  }

  function CustomStrong({ children }) {
    return (
      <strong className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-300 font-bold">
        {children}
      </strong>
    );
  }

  function CustomEmphasis({ children }) {
    return (
      <em className="text-slate-200 italic font-medium">
        {children}
      </em>
    );
  }

  function CustomDelete({ children }) {
    return (
      <del className="text-slate-500 line-through opacity-70">
        {children}
      </del>
    );
  }

  function CustomInput({ type, checked, disabled }) {
    if (type === 'checkbox') {
      return (
        <motion.input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="mr-3 w-4 h-4 rounded border-slate-500 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-900 bg-slate-700 cursor-not-allowed"
          readOnly
          whileHover={{ scale: 1.1 }}
        />
      );
    }
    return null;
  }

  function CustomHr() {
    return (
      <motion.div 
        className="my-10 relative"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <hr className="border-0 h-px bg-gradient-to-r from-transparent via-slate-500/50 to-transparent" />
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-slate-500 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    );
  }
};

export default ApiResponseViewer;