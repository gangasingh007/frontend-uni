import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApiResponseViewer = ({ text }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedSections, setExpandedSections] = useState(new Set());

  const copyToClipboard = useCallback(async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, []);

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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with language tag and actions */}
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/90 to-gray-800/70 px-4 py-2.5 rounded-t-lg border-b border-purple-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider">
                {match ? match[1] : 'code'}
              </span>
              {isLongCode && (
                <span className="text-xs text-gray-400 bg-gray-700/50 px-2 py-0.5 rounded">
                  {lineCount} lines
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isLongCode && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-700/60 hover:bg-purple-600/40 rounded-md transition-all duration-200 border border-gray-600/40 hover:border-purple-500/60"
                  aria-label={isExpanded ? "Collapse code" : "Expand code"}
                >
                  {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                  <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              )}
              
              <button
                onClick={() => copyToClipboard(codeString, codeIndex)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-700/60 hover:bg-purple-600/40 rounded-md transition-all duration-200 border border-gray-600/40 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20"
                aria-label="Copy code to clipboard"
              >
                {copiedCode === codeIndex ? (
                  <>
                    <Check size={13} className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Code content with collapse functionality */}
          <div className="bg-gradient-to-br from-gray-900/95 to-gray-900/85 rounded-b-lg overflow-hidden border border-gray-700/40 shadow-2xl">
            <AnimatePresence initial={false}>
              <motion.pre 
                className={`p-4 overflow-x-auto text-sm leading-relaxed ${
                  !isExpanded && isLongCode ? 'max-h-64' : ''
                } transition-all duration-300`}
                initial={false}
                animate={{ 
                  maxHeight: isExpanded ? 'none' : isLongCode ? '16rem' : 'none'
                }}
              >
                <code 
                  className={`${className || ''} text-gray-200 font-mono`}
                  {...props}
                >
                  {children}
                </code>
              </motion.pre>
            </AnimatePresence>
          </div>
          
          {/* Fade overlay for collapsed code */}
          {!isExpanded && isLongCode && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none rounded-b-lg" />
          )}
        </motion.div>
      );
    }

    return (
      <code 
        className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm font-mono border border-purple-500/30 shadow-sm hover:bg-purple-500/30 transition-colors" 
        {...props}
      >
        {children}
      </code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const headingId = String(children).toLowerCase().replace(/\s+/g, '-');
    
    const sizes = {
      1: "text-3xl md:text-4xl font-bold mb-6 mt-8",
      2: "text-2xl md:text-3xl font-semibold mb-5 mt-7",
      3: "text-xl md:text-2xl font-medium mb-4 mt-6",
      4: "text-lg md:text-xl font-medium mb-3 mt-5",
      5: "text-base md:text-lg font-medium mb-2 mt-4",
      6: "text-sm md:text-base font-medium mb-2 mt-3"
    };

    const colors = {
      1: "text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400",
      2: "text-gray-100",
      3: "text-gray-200",
      4: "text-gray-300",
      5: "text-gray-400",
      6: "text-gray-500"
    };

    const borders = {
      1: "border-l-4 border-purple-500 pl-4 bg-gradient-to-r from-purple-500/15 to-transparent hover:from-purple-500/25",
      2: "border-l-4 border-purple-400 pl-4 bg-gradient-to-r from-purple-400/10 to-transparent hover:from-purple-400/20",
      3: "border-l-3 border-purple-300 pl-3 bg-gradient-to-r from-purple-300/8 to-transparent hover:from-purple-300/15",
      4: "border-l-2 border-purple-200 pl-3 hover:border-purple-300",
      5: "border-l-2 border-purple-100 pl-3 hover:border-purple-200",
      6: "border-l border-purple-50 pl-2 hover:border-purple-100"
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Tag 
          id={headingId}
          className={`${sizes[level]} ${colors[level]} ${borders[level]} py-2 rounded-r-lg transition-all duration-300 scroll-mt-20 group`}
        >
          <span className="inline-flex items-center gap-2">
            {children}
            {level <= 2 && (
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-purple-400/50 text-sm">
                #
              </span>
            )}
          </span>
        </Tag>
      </motion.div>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <motion.blockquote 
      className="border-l-4 border-blue-400 bg-gradient-to-r from-blue-500/15 to-blue-500/5 pl-6 py-4 my-6 italic text-blue-200 rounded-r-lg backdrop-blur-sm shadow-lg hover:shadow-xl hover:from-blue-500/20 transition-all duration-300"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ x: 4 }}
    >
      {children}
    </motion.blockquote>
  );

  const CustomList = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-4 space-y-2.5 text-gray-300`}>
        {children}
      </Component>
    );
  };

  const CustomListItem = ({ children }) => (
    <motion.li 
      className="text-gray-300 leading-relaxed pl-2 hover:text-gray-100 transition-colors marker:text-purple-400"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.li>
  );

  const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-8 rounded-lg border border-gray-600/50 shadow-2xl hover:border-gray-500/50 transition-colors">
      <table className="min-w-full divide-y divide-gray-600/40">
        {children}
      </table>
    </div>
  );

  const CustomTableHeader = ({ children }) => (
    <thead className="bg-gradient-to-r from-purple-600/40 to-purple-600/30 backdrop-blur-sm">
      {children}
    </thead>
  );

  const CustomTableRow = ({ children }) => (
    <tr className="border-b border-gray-600/30 hover:bg-purple-500/10 transition-colors duration-200">
      {children}
    </tr>
  );

  const CustomTableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-6 py-4 text-left ${
        isHeader 
          ? 'font-semibold text-purple-200 bg-gray-800/50 text-sm uppercase tracking-wide' 
          : 'text-gray-300'
      }`}>
        {children}
      </Component>
    );
  };

  const CustomLink = ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/60 hover:decoration-purple-300 underline-offset-2 transition-all duration-200 font-medium hover:bg-purple-500/10 px-1 rounded inline-flex items-center gap-1"
    >
      {children}
      <span className="text-xs opacity-60">↗</span>
    </a>
  );

  const CustomParagraph = ({ children }) => (
    <p className="text-gray-300 leading-7 mb-4 text-base">
      {children}
    </p>
  );

  const CustomStrong = ({ children }) => (
    <strong className="text-white font-semibold bg-gradient-to-r from-purple-500/10 to-transparent px-1 rounded">
      {children}
    </strong>
  );

  const CustomEmphasis = ({ children }) => (
    <em className="text-purple-300 italic">
      {children}
    </em>
  );

  const CustomHr = () => (
    <hr className="my-8 border-t border-gray-700/50 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
  );

  return (
    <div className="w-full">
      <div className="max-w-none">
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              code: CustomCode,
              h1: ({ children }) => <CustomHeading level={1}>{children}</CustomHeading>,
              h2: ({ children }) => <CustomHeading level={2}>{children}</CustomHeading>,
              h3: ({ children }) => <CustomHeading level={3}>{children}</CustomHeading>,
              h4: ({ children }) => <CustomHeading level={4}>{children}</CustomHeading>,
              h5: ({ children }) => <CustomHeading level={5}>{children}</CustomHeading>,
              h6: ({ children }) => <CustomHeading level={6}>{children}</CustomHeading>,
              blockquote: CustomBlockquote,
              ul: ({ children }) => <CustomList ordered={false}>{children}</CustomList>,
              ol: ({ children }) => <CustomList ordered={true}>{children}</CustomList>,
              li: CustomListItem,
              table: CustomTable,
              thead: CustomTableHeader,
              tr: CustomTableRow,
              td: ({ children }) => <CustomTableCell>{children}</CustomTableCell>,
              th: ({ children }) => <CustomTableCell isHeader>{children}</CustomTableCell>,
              a: CustomLink,
              p: CustomParagraph,
              strong: CustomStrong,
              em: CustomEmphasis,
              hr: CustomHr,
            }}
          >
            {text || "# Welcome\n\nYour AI-generated content will appear here."}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ApiResponseViewer;
