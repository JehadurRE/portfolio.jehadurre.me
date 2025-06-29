import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Trophy, Star, CheckCircle } from 'lucide-react';
import { supabase, type Achievement } from '../../lib/supabase';
import AchievementForm from './AchievementForm';

const AchievementManager: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<'all' | 'award' | 'recognition' | 'milestone'>('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAchievements();
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'all') return true;
    return achievement.category === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'award': return <Trophy className="w-5 h-5" />;
      case 'recognition': return <Star className="w-5 h-5" />;
      case 'milestone': return <CheckCircle className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'award': return 'from-yellow-500 to-orange-500';
      case 'recognition': return 'from-purple-500 to-pink-500';
      case 'milestone': return 'from-green-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  if (showForm) {
    return (
      <AchievementForm
        achievement={editingAchievement}
        onSave={() => {
          setShowForm(false);
          setEditingAchievement(null);
          fetchAchievements();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingAchievement(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
            Achievements
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage your awards, recognition, and milestones
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Achievement</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'award', 'recognition', 'milestone'] as const).map((filterOption) => (
          <motion.button
            key={filterOption}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === filterOption
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Achievements List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-8 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryColor(achievement.category)} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                    {achievement.icon}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-accent-600 dark:text-accent-400 font-medium">
                        {achievement.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(achievement.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            setEditingAchievement(achievement);
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(achievement.id)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-4">
                    {achievement.details}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(achievement.category)}
                    <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400 capitalize">
                      {achievement.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredAchievements.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
                No achievements found
              </h3>
              <p className="text-secondary-500 dark:text-secondary-500">
                {filter === 'all' 
                  ? 'Add your first achievement to get started'
                  : `No ${filter} achievements available`
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementManager;