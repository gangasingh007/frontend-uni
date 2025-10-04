import React from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check, FileText } from "lucide-react";
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

  const CustomCode = ({ node, inline, className, children, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');
    const codeIndex = `code-${Math.random().toString(36).substr(2, 9)}`;

    if (!inline) {
      return (
        <div className="relative group my-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-gray-800/80 to-gray-800/60 px-4 py-2.5 rounded-t-lg border-b border-purple-500/20">
            <span className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              {match ? match[1] : 'code'}
            </span>
            <button
              onClick={() => copyToClipboard(codeString, codeIndex)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-300 hover:text-white bg-gray-700/60 hover:bg-purple-600/40 rounded-md transition-all duration-200 border border-gray-600/40 hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20"
            >
              {copiedCode === codeIndex ? (
                <>
                  <Check size={13} className="text-green-400" />
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  Copy
                </>
              )}
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-gray-900/90 to-gray-900/70 rounded-b-lg overflow-hidden border border-gray-700/30 shadow-xl">
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

    return (
      <code 
        className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded text-sm font-mono border border-purple-500/30 shadow-sm" 
        {...props}
      >
        {children}
      </code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const sizes = {
      1: "text-3xl md:text-4xl font-bold mb-6 mt-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400",
      2: "text-2xl md:text-3xl font-semibold mb-4 mt-6 text-gray-100",
      3: "text-xl md:text-2xl font-medium mb-3 mt-5 text-gray-200",
      4: "text-lg md:text-xl font-medium mb-2 mt-4 text-gray-300",
      5: "text-base md:text-lg font-medium mb-2 mt-3 text-gray-400",
      6: "text-sm md:text-base font-medium mb-1 mt-2 text-gray-500"
    };

    const borders = {
      1: "border-l-4 border-purple-500 pl-4 bg-gradient-to-r from-purple-500/15 to-transparent",
      2: "border-l-4 border-purple-400 pl-4 bg-gradient-to-r from-purple-400/10 to-transparent",
      3: "border-l-3 border-purple-300 pl-4 bg-gradient-to-r from-purple-300/8 to-transparent",
      4: "border-l-2 border-purple-200 pl-3",
      5: "border-l-2 border-purple-100 pl-3",
      6: "border-l border-purple-50 pl-2"
    };

    return (
      <Tag className={`${sizes[level]} ${borders[level]} py-2 rounded-r-lg`}>
        {children}
      </Tag>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 bg-gradient-to-r from-blue-500/15 to-blue-500/5 pl-6 py-4 my-5 italic text-blue-200 rounded-r-lg backdrop-blur-sm shadow-lg">
      {children}
    </blockquote>
  );

  const CustomList = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-3 space-y-2 text-gray-300`}>
        {children}
      </Component>
    );
  };

  const CustomListItem = ({ children }) => (
    <li className="text-gray-300 leading-relaxed pl-1 hover:text-gray-100 transition-colors">
      {children}
    </li>
  );

  const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-6 rounded-lg border border-gray-600/40 shadow-xl">
      <table className="min-w-full">
        {children}
      </table>
    </div>
  );

  const CustomTableHeader = ({ children }) => (
    <thead className="bg-gradient-to-r from-purple-600/30 to-purple-600/20">
      {children}
    </thead>
  );

  const CustomTableRow = ({ children }) => (
    <tr className="border-b border-gray-600/30 hover:bg-purple-500/10 transition-colors">
      {children}
    </tr>
  );

  const CustomTableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-6 py-3 text-left ${isHeader ? 'font-semibold text-purple-200 bg-gray-800/40' : 'text-gray-300'}`}>
        {children}
      </Component>
    );
  };

  const CustomLink = ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/60 hover:decoration-purple-300 transition-all duration-200 font-medium hover:bg-purple-500/10 px-1 rounded"
    >
      {children}
    </a>
  );

  const CustomParagraph = ({ children }) => (
    <p className="text-gray-300 leading-7 mb-4 text-base">
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
    <div className="min-h-screen bg-gradient-to-br from-black/40 via-blue-950/10 to-black/40 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-10">
        <div className="bg-black/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden">
          <div className="max-h-100vh overflow-y-auto custom-scrollbar">
            <div className="p-8 md:p-10 lg:p-12">
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
                {text || "# Welcome\n\nYour markdown content will appear here."}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
          margin: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.6), rgba(236, 72, 153, 0.6));
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(168, 85, 247, 0.8), rgba(236, 72, 153, 0.8));
        }
      `}</style>
    </div>
  );
};

export default ApiResponseViewer;