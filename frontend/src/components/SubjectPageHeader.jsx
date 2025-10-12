import React from "react";
import {motion} from "framer-motion"
import { GraduationCap, Plus, Users } from "lucide-react";

const SubjectPageHeader = ({ subjectCount, userInfo, onAddClick, isAdmin }) => (
    <motion.div
        className="mb-12"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
    >
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
            <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r pb-3 from-blue-400 via-purple-500 to-pink-400 bg-clip-text text-transparent">
                    Subjects
                </h1>
                <p className="text-lg text-gray-400 max-w-md">Manage your academic subjects and course materials.</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-2"><GraduationCap size={16} /><span>{subjectCount} Subjects</span></div>
                    <div className="flex items-center gap-2"><Users size={16} /><span>{userInfo}</span></div>
                </div>
            </div>
            {isAdmin && (
                <motion.button onClick={onAddClick} className="group relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg hover:shadow-purple-500/30 transition-all duration-300" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Add Subject
                </motion.button>
            )}
        </div>
    </motion.div>
);

export default SubjectPageHeader;