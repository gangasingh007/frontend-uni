import React from "react";

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 -mx-4 transition-all duration-300 hover:bg-white/5 rounded-lg">
        <p className="text-md text-gray-400 font-medium mb-1 sm:mb-0">{label}</p>
        <p className="text-lg font-semibold text-gray-100 truncate">{value || 'Not specified'}</p>
    </div>
);

export default DetailRow;