import React from "react";
import {motion} from "framer-motion"
import { Camera, Edit3, ShieldCheck } from "lucide-react";

const ProfileSidebar = ({ user, onEditClick }) => (
    <div className="bg-gradient-to-br from-[rgba(20,20,35,0.6)] to-[rgba(10,10,15,0.5)] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl sticky top-28 text-center flex flex-col items-center">
        <motion.div className="relative group mb-6">
            <motion.div
                className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-all duration-500"
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-[#1c1c3a] to-[#0a0a0f] flex items-center justify-center text-white font-bold text-5xl shadow-2xl ring-4 ring-white/10 overflow-hidden">
                {user?.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <span>{(user?.firstName?.charAt(0) || 'U') + (user?.lastName?.charAt(0) || 'N')}</span>
                )}
            </div>
            <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Camera className="w-8 h-8 text-white" />
            </div>
        </motion.div>

        <h2 className="text-3xl pb-1 font-bold text-white truncate max-w-full">{`${user?.firstName || ''} ${user?.lastName || ''}`}</h2>
        <p className="text-gray-400 truncate max-w-full mt-1 mb-6">{user?.email || ''}</p>
        
        {/* ENHANCEMENT: Added a glowing shadow to the verified badge */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-300 text-sm px-3 py-1 rounded-full mb-8 shadow-[0_0_10px_rgba(45,212,191,0.3)]">
            <ShieldCheck size={16} />
            <span>Verified Account</span>
        </div>
        
        <motion.button
            onClick={onEditClick}
            className="flex w-full items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-purple-500/40 transition-all duration-300 group"
            whileHover={{ scale: 1.05, y: -3 }} whileTap={{ scale: 0.95 }}
        >
            <Edit3 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Edit Profile
        </motion.button>
    </div>
);

export default ProfileSidebar;