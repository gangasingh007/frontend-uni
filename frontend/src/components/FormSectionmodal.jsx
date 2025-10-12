import React from "react";
import {motion} from "framer-motion"

const FormSectionModal = ({ title, icon: Icon, children }) => (
    <motion.div className="space-y-6" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
        <div className="flex items-center gap-3 pb-4 border-b border-white/10"><div className="p-2 bg-purple-500/20 rounded-lg"><Icon className="w-5 h-5 text-purple-400" /></div><h3 className="text-xl font-semibold text-white">{title}</h3></div>
        {children}
    </motion.div>
);

export default FormSectionModal;