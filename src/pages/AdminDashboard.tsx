import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Award, 
  Trophy, 
  Plus, 
  LogOut, 
  Users,
  TrendingUp,
  Calendar,
  Settings,
  Code
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import BlogManager from '../components/admin/BlogManager';
import CertificationManager from '../components/admin/CertificationManager';
import AchievementManager from '../components/admin/AchievementManager';
import SkillManager from '../components/admin/SkillManager';
import DashboardOverview from '../components/admin/DashboardOverview';

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveTab = 'overview' | 'blog' | 'certifications' | 'achievements' | 'skills';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'blog', name: 'Blog Posts', icon: FileText },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'achievements', name: 'Achievements', icon: Trophy },
    { id: 'skills', name: 'Skills', icon: Code },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview />;
      case 'blog':
        return <BlogManager />;
      case 'certifications':
        return <CertificationManager />;
      case 'achievements':
        return <AchievementManager />;
      case 'skills':
        return <SkillManager />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-64 min-h-screen glass-card border-r border-secondary-200 dark:border-secondary-700"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gradient">Admin Panel</h1>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Portfolio Manager</p>
              </div>
            </div>

            {/* User Info */}
            <div className="glass-card p-4 rounded-xl mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-secondary-800 dark:text-secondary-200">
                    {user?.email || 'Admin'}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">Administrator</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg'
                      : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </motion.button>
              ))}
            </nav>

            {/* Logout Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 mt-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card border-b border-secondary-200 dark:border-secondary-700 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
                  {tabs.find(tab => tab.id === activeTab)?.name}
                </h2>
                <p className="text-secondary-600 dark:text-secondary-400">
                  Manage your portfolio content
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="glass-card px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-primary-500" />
                    <span className="text-secondary-600 dark:text-secondary-300">
                      {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;