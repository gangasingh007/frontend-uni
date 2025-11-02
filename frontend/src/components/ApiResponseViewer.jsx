import React, { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ApiResponseViewer = ({ text }) => {
  const [copiedCode, setCopiedCode] = useState(null);

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
          className="relative group my-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-slate-800 to-slate-750 px-4 py-2.5 rounded-t-xl border border-slate-700/60">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80"></span>
              </div>
              <span className="text-xs font-medium text-slate-300 tracking-wide">
                {match ? match[1] : 'code'}
              </span>
              {isLongCode && (
                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-0.5 rounded-md">
                  {lineCount} lines
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {isLongCode && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-600/80 rounded-lg transition-all duration-200"
                  aria-label={isExpanded ? "Collapse code" : "Expand code"}
                >
                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  <span className="hidden sm:inline">{isExpanded ? 'Collapse' : 'Expand'}</span>
                </button>
              )}
              
              <button
                onClick={() => copyToClipboard(codeString, codeIndex)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-600/80 rounded-lg transition-all duration-200"
                aria-label="Copy code to clipboard"
              >
                {copiedCode === codeIndex ? (
                  <>
                    <Check size={14} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Code content */}
          <div className="bg-slate-900/95 rounded-b-xl overflow-hidden border-x border-b border-slate-700/60">
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
                  className={`${className || ''} text-slate-200 font-mono text-[13px]`}
                  {...props}
                >
                  {children}
                </code>
              </motion.pre>
            </AnimatePresence>
          </div>
          
          {/* Fade overlay */}
          {!isExpanded && isLongCode && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent pointer-events-none rounded-b-xl" />
          )}
        </motion.div>
      );
    }

    return (
      <code 
        className="bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-md text-[13.5px] font-mono border border-indigo-500/20 hover:bg-indigo-500/15 transition-colors" 
        {...props}
      >
        {children}
      </code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const headingId = String(children).toLowerCase().replace(/\s+/g, '-');
    
    const styles = {
      1: {
        size: "text-3xl md:text-4xl font-bold mb-5 mt-8",
        color: "text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400",
        border: "border-l-4 border-indigo-500/60 pl-5 py-2"
      },
      2: {
        size: "text-2xl md:text-3xl font-semibold mb-4 mt-7",
        color: "text-slate-100",
        border: "border-l-[3px] border-indigo-400/50 pl-4 py-1.5"
      },
      3: {
        size: "text-xl md:text-2xl font-semibold mb-3 mt-6",
        color: "text-slate-200",
        border: "border-l-[3px] border-indigo-300/40 pl-4 py-1"
      },
      4: {
        size: "text-lg md:text-xl font-medium mb-3 mt-5",
        color: "text-slate-300",
        border: "border-l-2 border-indigo-200/30 pl-3"
      },
      5: {
        size: "text-base md:text-lg font-medium mb-2 mt-4",
        color: "text-slate-400",
        border: "pl-2"
      },
      6: {
        size: "text-sm md:text-base font-medium mb-2 mt-3",
        color: "text-slate-500",
        border: "pl-2"
      }
    };

    const style = styles[level];

    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tag 
          id={headingId}
          className={`${style.size} ${style.color} ${style.border} rounded-r-md transition-all duration-200 scroll-mt-20 group hover:pl-6`}
        >
          {children}
        </Tag>
      </motion.div>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <motion.blockquote 
      className="border-l-4 border-sky-400/60 bg-gradient-to-r from-sky-500/10 to-transparent pl-5 pr-4 py-3 my-5 italic text-slate-300 rounded-r-lg"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.blockquote>
  );

  const CustomList = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-4 space-y-2 text-slate-300 marker:text-indigo-400/70`}>
        {children}
      </Component>
    );
  };

  const CustomListItem = ({ children, className }) => {
    // Check if this is a task list item (GFM feature)
    const isTaskList = className?.includes('task-list-item');
    
    return (
      <li 
        className={`text-slate-300 leading-7 pl-2 hover:text-slate-100 transition-colors ${
          isTaskList ? 'list-none -ml-6' : ''
        }`}
      >
        {children}
      </li>
    );
  };

  const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-xl border border-slate-700/50 shadow-lg">
      <table className="min-w-full divide-y divide-slate-700/40">
        {children}
      </table>
    </div>
  );

  const CustomTableHeader = ({ children }) => (
    <thead className="bg-gradient-to-r from-slate-800 to-slate-750">
      {children}
    </thead>
  );

  const CustomTableRow = ({ children }) => (
    <tr className="border-b border-slate-700/30 hover:bg-indigo-500/5 transition-colors duration-150">
      {children}
    </tr>
  );

  const CustomTableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-5 py-3.5 text-left ${
        isHeader 
          ? 'font-semibold text-slate-200 text-sm tracking-wide' 
          : 'text-slate-300 text-sm'
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
      className="text-indigo-400 hover:text-indigo-300 underline decoration-indigo-400/40 hover:decoration-indigo-300/60 underline-offset-2 transition-all duration-200 font-medium"
    >
      {children}
    </a>
  );

  const CustomParagraph = ({ children }) => (
    <p className="text-slate-300 leading-7 mb-4 text-[15px]">
      {children}
    </p>
  );

  const CustomStrong = ({ children }) => (
    <strong className="text-slate-100 font-semibold">
      {children}
    </strong>
  );

  const CustomEmphasis = ({ children }) => (
    <em className="text-slate-300 italic">
      {children}
    </em>
  );

  // GFM: Strikethrough support
  const CustomDelete = ({ children }) => (
    <del className="text-slate-400 line-through opacity-75">
      {children}
    </del>
  );

  // GFM: Task list checkbox styling
  const CustomInput = ({ type, checked, disabled }) => {
    if (type === 'checkbox') {
      return (
        <input
          type="checkbox"
          checked={checked}
          disabled={disabled}
          className="mr-2 w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800 bg-slate-700 cursor-not-allowed"
        />
      );
    }
    return <input type={type} checked={checked} disabled={disabled} />;
  };

  const CustomHr = () => (
    <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent" />
  );

  return (
    <div className="w-full">
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
              del: CustomDelete,
              input: CustomInput,
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
