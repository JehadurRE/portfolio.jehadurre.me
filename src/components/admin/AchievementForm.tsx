import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { supabase, type Achievement } from '../../lib/supabase';

interface AchievementFormProps {
  achievement?: Achievement | null;
  onSave: () => void;
  onCancel: () => void;
}

const AchievementForm: React.FC<AchievementFormProps> = ({ achievement, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    category: 'award' as 'award' | 'recognition' | 'milestone',
    icon: '🏆',
    details: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconOptions = [
    { value: '🏆', label: 'Trophy' },
    { value: '🥇', label: 'Gold Medal' },
    { value: '🥈', label: 'Silver Medal' },
    { value: '🥉', label: 'Bronze Medal' },
    { value: '⭐', label: 'Star' },
    { value: '🎖️', label: 'Military Medal' },
    { value: '🏅', label: 'Sports Medal' },
    { value: '🎯', label: 'Target' },
    { value: '🚀', label: 'Rocket' },
    { value: '💎', label: 'Diamond' },
    { value: '👑', label: 'Crown' },
    { value: '🔥', label: 'Fire' },
    { value: '⚡', label: 'Lightning' },
    { value: '🌟', label: 'Glowing Star' },
    { value: '💫', label: 'Dizzy Star' },
    { value: '🎓', label: 'Graduation Cap' },
    { value: '📚', label: 'Books' },
    { value: '🔬', label: 'Microscope' },
    { value: '💻', label: 'Laptop' },
    { value: '🎨', label: 'Artist Palette' },
    { value: '🎪', label: 'Circus Tent' },
    { value: '🎭', label: 'Performing Arts' },
    { value: '🎵', label: 'Musical Note' },
    { value: '🎸', label: 'Guitar' },
    { value: '🏃', label: 'Runner' },
    { value: '🏋️', label: 'Weight Lifter' },
    { value: '🧠', label: 'Brain' },
    { value: '💡', label: 'Light Bulb' },
    { value: '🔧', label: 'Wrench' },
    { value: '⚙️', label: 'Gear' },
    { value: '🛠️', label: 'Hammer and Wrench' },
    { value: '📈', label: 'Chart Increasing' },
    { value: '📊', label: 'Bar Chart' },
    { value: '🎯', label: 'Direct Hit' },
    { value: '🎪', label: 'Circus Tent' },
    { value: '❄️', label: 'Snowflake' },
    { value: '🌈', label: 'Rainbow' },
    { value: '🦄', label: 'Unicorn' },
    { value: '🎉', label: 'Party Popper' },
    { value: '🎊', label: 'Confetti Ball' },
    { value: '🎈', label: 'Balloon' },
  ];

  useEffect(() => {
    if (achievement) {
      setFormData({
        title: achievement.title,
        description: achievement.description,
        date: achievement.date,
        category: achievement.category,
        icon: achievement.icon,
        details: achievement.details,
      });
    }
  }, [achievement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const achievementData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        category: formData.category,
        icon: formData.icon,
        details: formData.details,
      };

      if (achievement) {
        const { error } = await supabase
          .from('achievements')
          .update(achievementData)
          .eq('id', achievement.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([achievementData]);
        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
            {achievement ? 'Edit Achievement' : 'Add New Achievement'}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {achievement ? 'Update achievement details' : 'Add a new achievement or milestone'}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="flex items-center space-x-2 px-4 py-2 glass-card text-secondary-600 dark:text-secondary-300 rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <X className="w-5 h-5" />
          <span>Cancel</span>
        </motion.button>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-card p-6 rounded-2xl space-y-6">
          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Best Paper Award"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Description *
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="International Conference on Software Engineering 2024"
              />
            </div>
          </div>

          {/* Date and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                <option value="award">Award</option>
                <option value="recognition">Recognition</option>
                <option value="milestone">Milestone</option>
              </select>
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Icon *
            </label>
            <div className="grid grid-cols-8 md:grid-cols-12 gap-2 mb-4">
              {iconOptions.map((option) => (
                <motion.button
                  key={option.value}
                  type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setFormData(prev => ({ ...prev, icon: option.value }))}
                  className={`p-3 text-2xl rounded-lg transition-all duration-200 ${
                    formData.icon === option.value
                      ? 'bg-primary-500 text-white shadow-lg'
                      : 'glass-card hover:shadow-md'
                  }`}
                  title={option.label}
                >
                  {option.value}
                </motion.button>
              ))}
            </div>
            <div className="flex items-center space-x-2 text-sm text-secondary-600 dark:text-secondary-400">
              <span>Selected:</span>
              <span className="text-2xl">{formData.icon}</span>
              <span>{iconOptions.find(opt => opt.value === formData.icon)?.label}</span>
            </div>
          </div>

          {/* Details */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Details *
            </label>
            <textarea
              value={formData.details}
              onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Provide detailed information about this achievement..."
            />
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{achievement ? 'Update Achievement' : 'Add Achievement'}</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AchievementForm;