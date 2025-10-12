import React from "react";
import {motion} from 'framer-motion'

const PageHeader = ({ navigate }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
                <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-2 pb-2">
                    Profile Settings
                </h1>
            </div>
        </div>
    </motion.div>
);

export default PageHeader;