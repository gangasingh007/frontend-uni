import React from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

const ApiResponseViewer = ({ text }) => {
  const [copiedCode, setCopiedCode] = useState(null);

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(index);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Fixed CustomCode component
  const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const codeIndex = `code-${Math.random().toString(36).substr(2, 9)}`;

    // Block code (with triple backticks)
    if (!inline) {
      return (
        <div className="relative group my-6">
          {/* Header with language and copy button */}
          <div className="flex items-center justify-between bg-gray-800/60 px-4 py-3 rounded-t-lg border-b border-gray-600/30">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
              {match ? match[1] : 'code'}
            </span>
            <button
              onClick={() => copyToClipboard(codeString, codeIndex)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-700/60 hover:bg-gray-600/70 rounded-md transition-all duration-200 border border-gray-600/30 hover:border-gray-500/50"
            >
              {copiedCode === codeIndex ? (
                <>
                  <Check size={14} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={14} />
                  Copy
                </>
              )}
            </button>
          </div>
          
          {/* Code content */}
          <div className="bg-gray-900/70 rounded-b-lg overflow-hidden">
            <pre className="p-4 overflow-x-auto text-sm leading-relaxed">
              <code 
                className={`${className || ''} text-gray-200 font-mono`}
                {...props}
              >
                {children}
              </code>
            </pre>
          </div>
        </div>
      );
    }

    // Inline code (with single backticks)
    return (
      <code 
        className="bg-gray-700/60 text-purple-300 px-2 py-1 rounded-md text-sm font-mono border border-gray-600/30" 
        {...props}
      >
        {children}
      </code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const sizes = {
      1: "text-3xl md:text-4xl font-bold mb-6 mt-8 text-white",
      2: "text-2xl md:text-3xl font-semibold mb-4 mt-7 text-gray-100",
      3: "text-xl md:text-2xl font-medium mb-3 mt-6 text-gray-200",
      4: "text-lg md:text-xl font-medium mb-2 mt-4 text-gray-300",
      5: "text-base md:text-lg font-medium mb-2 mt-3 text-gray-400",
      6: "text-sm md:text-base font-medium mb-1 mt-2 text-gray-500"
    };

    return (
      <Tag className={`${sizes[level]} border-l-4 border-purple-500 pl-4 bg-gradient-to-r from-purple-500/10 to-transparent py-2 rounded-r-lg`}>
        {children}
      </Tag>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 bg-blue-500/10 pl-6 py-4 my-6 italic text-blue-200 rounded-r-lg backdrop-blur-sm">
      {children}
    </blockquote>
  );

  const CustomList = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-4 space-y-2 text-gray-300`}>
        {children}
      </Component>
    );
  };

  const CustomListItem = ({ children }) => (
    <li className="text-gray-300 leading-relaxed pl-1">
      {children}
    </li>
  );

  const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-600/40">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  );

  const CustomTableHeader = ({ children }) => (
    <thead className="bg-purple-600/20">
      {children}
    </thead>
  );

  const CustomTableRow = ({ children }) => (
    <tr className="border-b border-gray-600/30 hover:bg-gray-800/40 transition-colors">
      {children}
    </tr>
  );

  const CustomTableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-6 py-3 text-left ${isHeader ? 'font-semibold text-purple-200 bg-gray-800/30' : 'text-gray-300'}`}>
        {children}
      </Component>
    );
  };

  const CustomLink = ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/60 hover:decoration-purple-300 transition-all duration-200 font-medium"
    >
      {children}
    </a>
  );

  const CustomParagraph = ({ children }) => (
    <p className="text-gray-300 leading-7 mb-5 text-base">
      {children}
    </p>
  );

  const CustomStrong = ({ children }) => (
    <strong className="text-white font-semibold">
      {children}
    </strong>
  );

  const CustomEmphasis = ({ children }) => (
    <em className="text-purple-300 italic">
      {children}
    </em>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-none mx-auto p-6 md:p-8 lg:p-12 prose prose-lg prose-invert">
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
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
      
      {/* Enhanced scrollbar styling */}
      <style jsx>{`
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.4);
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.6);
        }
      `}</style>
    </div>
  );
};

export default ApiResponseViewer;
