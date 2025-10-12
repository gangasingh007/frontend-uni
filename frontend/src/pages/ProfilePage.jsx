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
    ShieldCheck
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
            </div>
        );
    }

    return (
        <>
            <div className="relative min-h-screen w-full text-white overflow-x-hidden">
                <div className="absolute inset-0 -z-10">
                    <InteractiveBackground />
                </div>
                <div className="relative z-10 p-4 sm:p-6 lg:p-8"> {/* Added padding-top for Navbar */}
                    <motion.div
                        className="max-w-7xl mx-auto"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
                        }}
                    >
                        <PageHeader navigate={navigate} />
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Sidebar */}
                            <motion.div
                                className="lg:col-span-4"
                                variants={{
                                    hidden: { opacity: 0, x: -30 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
                                }}
                            >
                                <ProfileSidebar user={user} onEditClick={() => setIsEditModalOpen(true)} />
                            </motion.div>
                            {/* Right Content Area */}
                            <motion.div
                                className="lg:col-span-8 space-y-8"
                                variants={{
                                    hidden: { opacity: 0, x: 30 },
                                    visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15, delay: 0.1 } }
                                }}
                            >
                                <ProfileInfoSection title="Personal Details" icon={User}>
                                    <DetailRow label="First Name" value={user?.firstName} />
                                    <DetailRow label="Last Name" value={user?.lastName} />
                                    <DetailRow label="Email Address" value={user?.email} />
                                </ProfileInfoSection>
                                <ProfileInfoSection title="Academic Information" icon={GraduationCap}>
                                    <DetailRow label="Course" value={user?.courseName} />
                                    <DetailRow label="Section" value={user?.section} />
                                    <DetailRow label="Semester" value={user?.semester} />
                                    <DetailRow label="Roll Number" value={user?.rollNumber} />
                                    <DetailRow label="Account Role" value={user?.role} />
                                </ProfileInfoSection>
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