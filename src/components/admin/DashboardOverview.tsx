import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Award, Trophy, TrendingUp, Calendar, Users, Eye, Code } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Stats {
  totalBlogPosts: number;
  publishedPosts: number;
  totalCertifications: number;
  totalAchievements: number;
  totalSkills: number;
  featuredSkills: number;
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalBlogPosts: 0,
    publishedPosts: 0,
    totalCertifications: 0,
    totalAchievements: 0,
    totalSkills: 0,
    featuredSkills: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [blogPosts, certifications, achievements, skills] = await Promise.all([
          supabase.from('blog_posts').select('id, is_published'),
          supabase.from('certifications').select('id'),
          supabase.from('achievements').select('id'),
          supabase.from('skills').select('id, is_featured'),
        ]);

        setStats({
          totalBlogPosts: blogPosts.data?.length || 0,
          publishedPosts: blogPosts.data?.filter(post => post.is_published).length || 0,
          totalCertifications: certifications.data?.length || 0,
          totalAchievements: achievements.data?.length || 0,
          totalSkills: skills.data?.length || 0,
          featuredSkills: skills.data?.filter(skill => skill.is_featured).length || 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Blog Posts',
      value: stats.totalBlogPosts,
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      title: 'Published Posts',
      value: stats.publishedPosts,
      icon: Eye,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      title: 'Certifications',
      value: stats.totalCertifications,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
    {
      title: 'Achievements',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      textColor: 'text-orange-700 dark:text-orange-300',
    },
    {
      title: 'Total Skills',
      value: stats.totalSkills,
      icon: Code,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      textColor: 'text-indigo-700 dark:text-indigo-300',
    },
    {
      title: 'Featured Skills',
      value: stats.featuredSkills,
      icon: TrendingUp,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30',
      textColor: 'text-pink-700 dark:text-pink-300',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card p-8 rounded-2xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Welcome to Admin Dashboard
            </h1>
            <p className="text-secondary-600 dark:text-secondary-300 text-lg">
              Manage your portfolio content and track your progress
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center">
              <TrendingUp className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${card.bgColor}`}>
                <card.icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
                  {card.value}
                </div>
              </div>
            </div>
            <h3 className="text-sm font-medium text-secondary-600 dark:text-secondary-400">
              {card.title}
            </h3>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <FileText className="w-5 h-5" />
            <span className="font-medium">Create New Blog Post</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Award className="w-5 h-5" />
            <span className="font-medium">Add Certification</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Trophy className="w-5 h-5" />
            <span className="font-medium">Add Achievement</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-200"
          >
            <Code className="w-5 h-5" />
            <span className="font-medium">Add Skill</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass-card p-8 rounded-2xl"
      >
        <h2 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">
          Portfolio Status
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-secondary-700 dark:text-secondary-300">
                Portfolio website is live and accessible
              </span>
            </div>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-secondary-700 dark:text-secondary-300">
                Database connection established
              </span>
            </div>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">Connected</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-secondary-700 dark:text-secondary-300">
                Content management system ready
              </span>
            </div>
            <span className="text-sm text-secondary-500 dark:text-secondary-400">Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;