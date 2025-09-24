import React from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

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
    const codeIndex = Math.random().toString(36).substr(2, 9);

    if (!inline && match) {
      return (
        <div className="relative group my-4">
          <div className="flex items-center justify-between bg-gray-800/50 px-4 py-2 rounded-t-lg border-b border-gray-600/30">
            <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
              {match[1]}
            </span>
            <button
              onClick={() => copyToClipboard(codeString, codeIndex)
              }
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-white bg-gray-700/50 hover:bg-gray-600/50 rounded transition-all duration-200"
            >
              {copiedCode === codeIndex ? (
                <>
                  <Check size={12} />
                  Copied
                </>
              ) : (
                <div className="flex justify-center items-center"  onClick={()=>toast.success("Copies to clipboard")}>
                  <Copy size={12} className="mr-1" />
                  Copy
                </div>
              )}
            </button>
          </div>
          <pre className="bg-gray-900/50 p-4 rounded-b-lg overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        </div>
      );
    }

    return (
      <code 
        className="bg-gray-800/60 text-purple-300 px-1.5 py-0.5 rounded text-sm font-mono" 
        {...props}
      >
        {children}
      </code>
    );
  };

  const CustomHeading = ({ level, children }) => {
    const Tag = `h${level}`;
    const sizes = {
      1: "text-2xl md:text-3xl font-bold mb-4 mt-8 text-white",
      2: "text-xl md:text-2xl font-semibold mb-3 mt-6 text-gray-100",
      3: "text-lg md:text-xl font-medium mb-2 mt-4 text-gray-200",
      4: "text-base md:text-lg font-medium mb-2 mt-3 text-gray-300",
      5: "text-sm md:text-base font-medium mb-1 mt-2 text-gray-400",
      6: "text-xs md:text-sm font-medium mb-1 mt-2 text-gray-500"
    };

    return (
      <Tag className={`${sizes[level]} border-l-4 border-purple-500 pl-4 bg-gradient-to-r from-purple-500/10 to-transparent py-2 rounded-r`}>
        {children}
      </Tag>
    );
  };

  const CustomBlockquote = ({ children }) => (
    <blockquote className="border-l-4 border-blue-400 bg-blue-500/5 pl-4 py-2 my-4 italic text-blue-200 rounded-r">
      {children}
    </blockquote>
  );

  const CustomList = ({ ordered, children }) => {
    const Component = ordered ? 'ol' : 'ul';
    return (
      <Component className={`${ordered ? 'list-decimal' : 'list-disc'} ml-6 my-3 space-y-1`}>
        {children}
      </Component>
    );
  };

  const CustomListItem = ({ children }) => (
    <li className="text-gray-300 leading-relaxed">
      {children}
    </li>
  );

  const CustomTable = ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-600 rounded-lg overflow-hidden">
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
    <tr className="border-b border-gray-600/30 hover:bg-gray-800/30 transition-colors">
      {children}
    </tr>
  );

  const CustomTableCell = ({ children, isHeader }) => {
    const Component = isHeader ? 'th' : 'td';
    return (
      <Component className={`px-4 py-2 text-left ${isHeader ? 'font-semibold text-purple-200' : 'text-gray-300'}`}>
        {children}
      </Component>
    );
  };

  const CustomLink = ({ href, children }) => (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-purple-400 hover:text-purple-300 underline decoration-purple-400/50 hover:decoration-purple-300 transition-colors"
    >
      {children}
    </a>
  );

  const CustomParagraph = ({ children }) => (
    <p className="text-gray-300 leading-relaxed mb-4 text-base">
      {children}
    </p>
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
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
      
      {/* Custom scrollbar styles */}
      <style jsx>{`
        .prose::-webkit-scrollbar {
          width: 6px;
        }
        .prose::-webkit-scrollbar-track {
          background: transparent;
        }
        .prose::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.3);
          border-radius: 3px;
        }
        .prose::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.5);
        }
      `}</style>
    </div>
  );
};

export default ApiResponseViewer;
