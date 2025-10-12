import { AlertCircle } from "lucide-react";
import React from "react";

const InputFieldModal = ({ icon: Icon, label, error, required, ...props }) => (
    <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">{label} {required && <span className="text-red-400">*</span>}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors duration-300" />
            <input {...props} className={`w-full pl-12 pr-4 py-3 bg-black/30 border ${error ? 'border-red-500' : 'border-white/10'} focus:border-purple-500 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 ${error ? 'focus:ring-red-500/20' : 'focus:ring-purple-500/30'} transition-all duration-300`} />
        </div>
        {error && <p className="text-red-400 text-xs mt-1 flex items-center gap-1"><AlertCircle size={14} />{error}</p>}
    </div>
);

export default InputFieldModal;