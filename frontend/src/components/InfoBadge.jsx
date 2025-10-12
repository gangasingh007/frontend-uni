import React from "react";
import {motion} from 'framer-motion'

const InfoBadge = ({ icon: Icon, text }) => {
    if (!text) return null;
    return (
        <motion.div 
            className="flex items-center gap-2 bg-black/40 backdrop-blur-md rounded-lg px-4 py-2 border border-white/10"
            whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.2)' }}
        >
            <Icon className="w-5 h-5 text-blue-400" />
            <span className="font-medium text-sm text-gray-300 tracking-wide">{text}</span>
        </motion.div>
    );
};

export default InfoBadge;