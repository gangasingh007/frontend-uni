import axios from "axios"
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Instagram,
  BookOpen,
  Users,
  GraduationCap,
  Heart,
  ArrowRight,
  Computer,
  Sparkles,
  Laptop,
  Zap,
  Star,
  Shield,
  Clock,
  Award,
  BookAIcon,
  PhoneCall,
} from 'lucide-react';
import { useRecoilState } from "recoil";
import { statsAtom } from "../atoms/stats.Atom";


const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [users , setusers] = useState(0)
  const [resources , setresources] = useState(0)
  const [stats , setstats] = useRecoilState(statsAtom)

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/stats/getStats`)
        const response = res.data
        setusers(response.users ?? 0)
        setresources(response.resources ?? 0)
        setstats(response)
      } catch (error) {
        setusers(0)
        setresources(0)
        setstats({users: 0, resources: 0})
      }
    }

    fetchdata();
  }, [])
  

  const socialLinks = [
    { icon: Github, href: 'https://github.com/gangasingh007', label: 'GitHub' },
    { icon: Twitter, href: 'https://x.com/gangasingh1734', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/ganga.singh.007/', label: 'Instagram' }
  ];

  const features = [
    { icon: BookOpen, title: 'Access Subjects', description: 'Comprehensive learning resources' },
    { icon: Users, title: 'Community', description: 'Connect with peers and faculty (soon)' },
    { icon: Sparkles, title: 'AI summarization', description: 'Single Click Summarization' }
  ];

  const statsData = [
    { number: users, label: 'Students', icon: Users },    
    { number: resources, label: 'Resources', icon: BookOpen },
    { number: '24/7', label: 'Support', icon: Clock },
    { number: '100%', label: 'Free', icon: Heart }
  ];

  const achievements = [
    { icon: Award, title: 'Excellence', subtitle: 'Academic Quality' },
    { icon: Shield, title: 'Trusted', subtitle: 'Secure Platform' },
    { icon: Zap, title: 'Fast', subtitle: 'Quick Access' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#0a0a0f] via-[#04040a] to-[#05050a] border-t border-[#2a2a40] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[400px] h-[400px] bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-pink-500/5 blur-[100px] rounded-full -top-20 -left-20"></div>
        <div className="absolute w-[300px] h-[300px] bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-cyan-500/5 blur-[80px] rounded-full -bottom-10 -right-10"></div>
       
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-12">
         
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="mb-6">
              <motion.h3
                className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                UniConnect
              </motion.h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering students with comprehensive academic resources, seamless connectivity,
                and tools for educational excellence in the digital age.
              </p>
            </div>

            {/* Features Highlight */}
            <div className="space-y-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="flex items-center gap-3 group cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-blue-500/20 group-hover:from-purple-500/30 group-hover:to-blue-500/30 transition-all duration-300">
                      <Icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{feature.title}</p>
                      <p className="text-gray-500 text-xs">{feature.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Platform Stats
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {statsData.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-gradient-to-br from-[#1e1e32] to-[#0f0f1a] rounded-xl p-4 border border-purple-500/20 group-hover:border-purple-500/40 transition-all duration-300">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-xs text-gray-400">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Achievement Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-400" />
              Why Choose Us
            </h4>
            <div className="space-y-3">
              {achievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <motion.div
                    key={achievement.title}
                    className="relative group"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 8 }}
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-transparent to-purple-500/5 group-hover:to-purple-500/10 transition-all duration-300">
                      <div className="p-2 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-500/20 group-hover:from-orange-500/30 group-hover:to-pink-500/30 transition-all duration-300">
                        <Icon className="w-3 h-3 text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{achievement.title}</p>
                        <p className="text-gray-500 text-xs">{achievement.subtitle}</p>
                      </div>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-white text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="w-4 h-4 text-green-400" />
              Connect
            </h4>
           
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Laptop className="w-4 h-4 text-orange-400" />
                <span>Developed By Ganga Singh</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-purple-400" />
                <span>gangasingh1734@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+91-7087550589</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-green-400" />
                <span>Ludhiana, Punjab</span>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-3 tracking-wide">Follow</p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      className="relative group p-2.5 rounded-xl bg-[#1e1e32] text-gray-400 
                                shadow-inner shadow-black/20
                                hover:text-white transition-all duration-300"
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Icon */}
                      <Icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />

                      {/* Glow ring on hover */}
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-blue-500/20 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></span>

                      {/* Border highlight */}
                      <span className="absolute inset-0 rounded-xl border border-transparent 
                                      group-hover:border-purple-500/30 transition-all duration-500"></span>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-8 border-t border-[#2a2a40]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex justify-center flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} UniConnect</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;