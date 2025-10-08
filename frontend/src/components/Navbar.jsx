import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useNavigate, NavLink, useMatch } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    LogOut, User, ChevronDown, BookOpenCheck, CalendarClock, Menu, X, 
    BookOpen, Home, Sparkles, PackageSearch
} from 'lucide-react';
import { userAtom } from '../atoms/userAtom';
import { loadingAtom } from '../atoms/states.atom';

const useAuth = () => {
    const navigate = useNavigate();
    const [, setLoading] = useRecoilState(loadingAtom);

    const logout = () => {
        setLoading(true);
        setTimeout(() => {
            localStorage.removeItem("token");
            navigate("/login");
            toast.success("Logged out successfully.");
            setLoading(false);
        }, 500);
    };
    return { logout };
};

// Color mapping for dynamic styling
const colorMap = {
    purple: { text: 'text-purple-400', gradient: 'from-purple-500 to-indigo-500' },
    blue: { text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
    green: { text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
    orange: { text: 'text-orange-400', gradient: 'from-orange-500 to-orange-400' },
    cyan: { text: 'text-cyan-400', gradient: 'from-cyan-500 to-sky-500' },
};

/**
 * Main Navbar Component
 * Handles the overall layout and scroll behavior.
 */
const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // A single source of truth for navigation links
    const navLinks = [
        { href: "/", icon: Home, label: "Dashboard", color: "purple" },
        { href: "/profile", icon: User, label: "Profile", color: "green" },
        { href: "/subjects", icon: BookOpen, label: "Subjects", color: "blue" },
        { href: "/explore", icon: PackageSearch, label: "Explore", color: "cyan" },
        { href: "/syllabus", icon: BookOpenCheck, label: "Syllabus", color: "green" },
        { href: "/datesheet", icon: CalendarClock, label: "Datesheet", color: "orange" },
    ];

    // Desktop links exclude 'Profile' since it's handled separately now
    const desktopNavLinks = navLinks.filter(link => link.label !== 'Profile');

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 ${
                scrolled 
                    ? 'bg-black/60 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl shadow-purple-900/20' 
                    : 'bg-transparent'
            }`}
        >
            <div className="flex-1 flex justify-start"><Logo /></div>
            <div className="flex-none hidden lg:flex"><DesktopNav navLinks={desktopNavLinks} /></div>
            <div className="flex-1 flex justify-end items-center gap-4">
                <ProfileActions />
                <MobileNav navLinks={navLinks} />
            </div>
        </motion.nav>
    );
};

// --- Child Components ---

const Logo = () => (
    <NavLink to="/" className="relative text-2xl sm:text-3xl font-bold cursor-pointer group">
        <motion.div
            className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-pink-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <span className="relative bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            UniConnect
        </span>
        <Sparkles className="absolute -top-1 -right-2 w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity" />
    </NavLink>
);

const DesktopNav = ({ navLinks }) => (
    <div className="flex items-center gap-1 bg-black/20 border border-white/10 rounded-full p-1.5 shadow-inner shadow-black/20">
        {navLinks.map((link) => (
            <DesktopNavItem key={link.label} link={link} />
        ))}
    </div>
);

const DesktopNavItem = ({ link }) => {
    const match = useMatch(link.href);
    const commonClasses = "relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full z-10 transition-colors duration-300";
    const isActive = !!match;

    return (
        <NavLink to={link.href} className={`${commonClasses} ${isActive ? 'text-white' : 'text-gray-300 hover:text-white'}`}>
            <link.icon className={`${colorMap[link.color].text} w-4 h-4`} />
            <span>{link.label}</span>
            {isActive && (
                <motion.div
                    layoutId="desktop-nav-indicator"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
            )}
        </NavLink>
    );
};

/**
 * NEW: Replaces the dropdown with distinct Profile and Sign Out buttons.
 * Visible only on desktop.
 */
const ProfileActions = () => {
    const user = useRecoilValue(userAtom);
    const { logout } = useAuth();
    const profileMatch = useMatch("/profile");

    if (!user) return null;

    return (
        <div className="hidden lg:flex items-center gap-2">
            <NavLink 
                to="/profile" 
                className={`flex items-center gap-2 px-2 py-1.5 rounded-2xl transition-colors duration-300 ${profileMatch ? 'bg-white/10' : 'bg-black/30 hover:bg-black/50 border border-white/10'}`}
            >
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {user.firstName?.charAt(0).toUpperCase()}
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black/50"/>
                </div>
                <span className="text-white font-medium text-sm pr-1">{user.firstName}</span>
            </NavLink>
            <button
                onClick={logout}
                className="p-2.5 rounded-xl bg-black/30 hover:bg-red-500/20 border border-white/10 hover:border-red-500/50 transition-all duration-300 group relative"
            >
                <LogOut className="text-gray-300 group-hover:text-red-400 transition-colors" size={18} />
            </button>
        </div>
    );
};

const MobileNav = ({ navLinks }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { logout } = useAuth();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const menuVariants = {
        open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 35 } },
        closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 35 } }
    };

    return (
        <div className="lg:hidden">
            <motion.button onClick={() => setIsOpen(true)} className="p-2.5 rounded-full bg-black/40 border border-white/10 shadow-lg backdrop-blur-md" whileTap={{ scale: 0.9 }}>
                <Menu size={20} />
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/60" />
                        <motion.div variants={menuVariants} initial="closed" animate="open" exit="closed" className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-gray-950/90 backdrop-blur-2xl border-l border-white/10">
                            <div className="p-6 h-full flex flex-col">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                    <Logo />
                                    <motion.button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-white/10" whileHover={{ rotate: 90 }}>
                                        <X size={24} />
                                    </motion.button>
                                </div>
                                
                                {user && (
                                     <motion.div 
                                        className="mb-6"
                                        initial={{opacity: 0, y: -10}}
                                        animate={{opacity: 1, y: 0, transition: {delay: 0.2}}}
                                     >
                                        <p className="font-semibold text-white text-lg">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-400 truncate mt-1">{user.email}</p>
                                    </motion.div>
                                )}

                                <motion.ul className="flex-1 flex flex-col gap-2" variants={{ open: { transition: { staggerChildren: 0.07 } } }}>
                                    {navLinks.map((link) => (
                                        <MobileNavItem key={link.label} link={link} closeMenu={() => setIsOpen(false)} />
                                    ))}
                                </motion.ul>

                                <motion.div 
                                    className="mt-auto pt-6 border-t border-white/10"
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1, transition: {delay: 0.4}}}
                                >
                                    <MenuItem icon={LogOut} label="Sign Out" onClick={logout} isDanger />
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const MobileNavItem = ({ link, closeMenu }) => {
    const match = useMatch(link.href);
    const classes = `flex items-center gap-4 p-4 text-lg font-medium rounded-lg transition-colors duration-200 ${
        match ? `bg-gradient-to-r ${colorMap[link.color].gradient} text-white shadow-lg` : 'hover:bg-white/5 text-gray-300'
    }`;

    return (
        <motion.li variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}>
            <NavLink to={link.href} onClick={closeMenu} className={classes}>
                <link.icon size={22} />
                <span>{link.label}</span>
            </NavLink>
        </motion.li>
    );
};

const MenuItem = ({ icon: Icon, label, onClick, isDanger = false }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-md transition-colors ${isDanger ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-300 hover:bg-white/5'}`}>
        <Icon size={16} />
        <span>{label}</span>
    </button>
);

export default Navbar;