import { ArrowRight } from "lucide-react";
import React from "react";
import {motion} from 'framer-motion'


const QuickActionButton = ({ icon: Icon, label, description, color, onClick, index }) => (
    <motion.button
        onClick={onClick}
        className="group relative text-left p-5 bg-gray-900/50 backdrop-blur-md rounded-xl border border-white/10 hover:border-white/20 transition-colors duration-300 overflow-hidden"
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { delay: 1.2 + index * 0.1 } } }}
        whileHover={{ 
            y: -6, 
            scale: 1.03, 
            boxShadow: `0 10px 30px -5px rgba(0,0,0,0.4), 0 0 15px ${color.startsWith('from-purple') ? 'rgba(192, 132, 252, 0.2)' : color.startsWith('from-sky') ? 'rgba(56, 189, 248, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`
        }}
        whileTap={{ scale: 0.98, y: -2 }}
    >
        {/* Glint Effect */}
        <div className="absolute top-0 left-[-100%] h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-[100%] opacity-50"></div>
        
        <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${color} shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">{label}</h3>
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-500 absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform translate-x-2 z-10" />
    </motion.button>
);

export default QuickActionButton;