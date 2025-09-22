import React from "react";
import ReactMarkdown from "react-markdown";

const ApiResponseViewer = ({ text }) => {
  return (
    <div className="p-6 max-w-3xl mx-auto shadow rounded-lg prose">
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default ApiResponseViewer;
