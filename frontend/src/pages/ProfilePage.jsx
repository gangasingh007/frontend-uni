import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { userAtom } from '../atoms/userAtom';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import {
    User, Edit3, Mail, GraduationCap, Calendar, Hash, Book, Users, X, Eye, EyeOff,
    ArrowLeft, CheckCircle2, AlertCircle, Lock, Camera, Sparkles,
    ShieldCheck, Home
} from 'lucide-react';
import InteractiveBackground from '../components/InteractiveBackground';
import ProfileInfoSection from '../components/ProfileInfoSection';
import PageHeader from '../components/PageHeader';
import ProfileSidebar from '../components/ProfileSidebar';
import DetailRow from '../components/DetailRow';
import EditProfileModal from '../components/EditProfileModal';

const ProfilePage = () => {
    const [user, setUser] = useRecoilState(userAtom);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            toast.error("Please log in to view your profile.");
            navigate("/login");
        }
    }, [user, navigate]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#141423] to-[#1a1a2e]">
                <motion.div
                    className="relative"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"></div>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen w-full text-white overflow-x-hidden">
                <div className="absolute inset-0 -z-10">
                    <InteractiveBackground />
                </div>
                
                <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                    <motion.div
                        className="max-w-7xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        {/* Enhanced Header with Navigation */}
                        <motion.div
                            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                            variants={{
                                hidden: { opacity: 0, y: -20 },
                                visible: { opacity: 1, y: 0 }
                            }}
                        >
                            <div className="flex items-center gap-4">    
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text pb-2 text-transparent">
                                        My Profile
                                    </h1>
                                    <p className="text-gray-400 text-sm mt-1">Manage your account information</p>
                                </div>
                            </div>

                            <motion.button
                                onClick={() => navigate('/')}
                                className="group relative px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 hover:border-purple-400 transition-all duration-300 overflow-hidden"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center gap-2">
                                    <Home className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                                    <span className="font-medium text-white group-hover:text-purple-100 transition-colors">
                                        Back to Home
                                    </span>
                                </div>
                            </motion.button>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {/* Enhanced Left Sidebar */}
                            <motion.div
                                className="lg:col-span-4"
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { 
                                        opacity: 1, 
                                        x: 0, 
                                        transition: { 
                                            type: 'spring', 
                                            stiffness: 100, 
                                            damping: 15 
                                        } 
                                    }
                                }}
                            >
                                <ProfileSidebar 
                                    user={user} 
                                    onEditClick={() => setIsEditModalOpen(true)} 
                                />
                            </motion.div>

                            {/* Enhanced Right Content Area */}
                            <motion.div
                                className="lg:col-span-8 space-y-6"
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    visible: { 
                                        opacity: 1, 
                                        x: 0, 
                                        transition: { 
                                            type: 'spring', 
                                            stiffness: 100, 
                                            damping: 15, 
                                            delay: 0.1 
                                        } 
                                    }
                                }}
                            >
                                {/* Personal Details Card */}
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <ProfileInfoSection 
                                        title="Personal Details" 
                                        icon={User}
                                    >
                                        <DetailRow label="First Name" value={user?.firstName} />
                                        <DetailRow label="Last Name" value={user?.lastName} />
                                        <DetailRow label="Email Address" value={user?.email} />
                                    </ProfileInfoSection>
                                </motion.div>

                                {/* Academic Information Card */}
                                <motion.div
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <ProfileInfoSection 
                                        title="Academic Information" 
                                        icon={GraduationCap}
                                    >
                                        <DetailRow label="Course" value={user?.courseName} />
                                        <DetailRow label="Section" value={user?.section} />
                                        <DetailRow label="Semester" value={user?.semester} />
                                        <DetailRow label="Roll Number" value={user?.rollNumber} />
                                        <DetailRow label="Account Role" value={user?.role} />
                                    </ProfileInfoSection>
                                </motion.div>                             
                            </motion.div>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {isEditModalOpen && (
                            <EditProfileModal
                                isOpen={isEditModalOpen}
                                onClose={() => setIsEditModalOpen(false)}
                                user={user}
                                setUser={setUser}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;