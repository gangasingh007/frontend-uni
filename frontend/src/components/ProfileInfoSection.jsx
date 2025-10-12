import React from "react";

const ProfileInfoSection = ({ title, icon: Icon, children }) => (
    <div className="bg-gradient-to-br from-[rgba(20,20,35,0.6)] to-[rgba(10,10,15,0.5)] border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl p-8 group transition-all duration-300 hover:border-white/20 hover:shadow-purple-500/10">
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
            <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <Icon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="divide-y divide-white/5">
            {children}
        </div>
    </div>
);

export default ProfileInfoSection