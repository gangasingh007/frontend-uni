import React from "react";
import {motion} from "framer-motion"
import { CheckCircle2 } from "lucide-react";

const ActionButtonModal = ({ isLoading, isSuccess, children, variant = 'primary', className = '', ...props }) => {
    const variants = { primary: "bg-gradient-to-r from-purple-600 to-blue-500 hover:shadow-lg hover:shadow-purple-500/40 text-white", secondary: "bg-black/30 hover:bg-black/50 border-white/10 text-gray-300 border hover:border-white/20" };
    const currentVariant = isSuccess ? "bg-green-500 text-white" : variants[variant];
    return (<motion.button className={`px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center shadow-md disabled:opacity-50 disabled:cursor-not-allowed ${currentVariant} ${className}`} whileHover={{ scale: (isLoading || isSuccess) ? 1 : 1.03, y: (isLoading || isSuccess) ? 0 : -2 }} whileTap={{ scale: (isLoading || isSuccess) ? 1 : 0.98 }} {...props}> {isLoading ? <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/50 border-t-white" /> : isSuccess ? <><CheckCircle2 size={20} className="mr-2" /> Success!</> : children} </motion.button>);
};

export default ActionButtonModal;
