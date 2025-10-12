import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, 
  X, 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff 
} from "lucide-react"; 

import FormSectionModal from "./FormSectionmodal";
import InputFieldModal from "./InputFieldModal";
import ActionButtonModal from "./ActionButtonModal";



const EditProfileModal = ({ isOpen, onClose, user, setUser }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setFormData({
                firstName: user?.firstName || '', lastName: user?.lastName || '', email: user?.email || '',
                courseName: user?.courseName || '', section: user?.section || '', semester: user?.semester || '',
                rollNumber: user?.rollNumber || '', password: '', confirmPassword: ''
            });
            setErrors({});
            setIsSuccess(false);
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen, user]);

    const validate = () => {
        const newErrors = {};
        if (!formData.firstName) newErrors.firstName = 'First name is required';
        if (!formData.lastName) newErrors.lastName = 'Last name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return toast.error("Please fix errors before submitting.");

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            const payload = { ...formData };
            if (!payload.password) delete payload.password;
            delete payload.confirmPassword;

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/student/update`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error(`Server responded with ${res.status}`);
            
            const data = await res.json();
            setUser(prev => ({ ...prev, ...data.user }));
            toast.success("Profile updated successfully!");
            setIsSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch (error) {
            console.error("Update Error:", error);
            toast.error("An error occurred while updating.");
        } finally {
            setTimeout(() => setIsLoading(false), 1500);
        }
    };

    return (
        <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
            <motion.div
                className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
                onClick={onClose}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            />
            <motion.div
                className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl p-8 sm:p-10 shadow-2xl bg-gradient-to-br from-[rgba(20,20,35,0.8)] to-[rgba(10,10,15,0.7)] backdrop-blur-2xl"
                initial={{ scale: 0.9, y: 30, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 30, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            >
                {/* ENHANCEMENT: Added a decorative gradient border effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-t-3xl" />
                
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center gap-3">
                        <Sparkles /> Edit Profile
                    </h2>
                    <motion.button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/50 text-gray-400 hover:text-white transition-colors" whileHover={{ scale: 1.1, rotate: 90 }}>
                        <X size={26} />
                    </motion.button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-8">
                    <FormSectionModal title="Personal Information" icon={User}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputFieldModal icon={User} label="First Name" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} required />
                            <InputFieldModal icon={User} label="Last Name" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} required />
                        </div>
                        <InputFieldModal icon={Mail} label="Email Address" type="email" name="email" value={formData.email || ''} onChange={handleChange} error={errors.email} required />
                    </FormSectionModal>
                   
                    <FormSectionModal title="Security" icon={Lock}>
                        <div className="grid md:grid-cols-2 gap-6">
                            <InputFieldModal icon={Lock} label="New Password" type={showPassword ? "text" : "password"} name="password" value={formData.password || ''} onChange={handleChange} error={errors.password} placeholder="Leave blank to keep current" />
                            <InputFieldModal icon={Lock} label="Confirm Password" type={showPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} error={errors.confirmPassword} placeholder="Confirm new password" />
                        </div>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-gray-400 hover:text-white flex items-center gap-2 mt-2 transition-colors">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            {showPassword ? 'Hide' : 'Show'} Passwords
                        </button>
                    </FormSectionModal>
                    <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t border-white/10">
                        <ActionButtonModal type="submit" isLoading={isLoading} isSuccess={isSuccess} className="flex-1">Save Changes</ActionButtonModal>
                        <ActionButtonModal type="button" variant="secondary" onClick={onClose} disabled={isLoading} className="flex-1">Cancel</ActionButtonModal>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditProfileModal;