import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { supabase, type Skill } from '../../lib/supabase';

interface SkillFormProps {
  skill?: Skill | null;
  onSave: () => void;
  onCancel: () => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ skill, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend' as 'frontend' | 'backend' | 'research' | 'tools' | 'database' | 'cloud' | 'mobile',
    technologies: '',
    icon: 'Code',
    proficiency_level: 3,
    years_experience: 1,
    description: '',
    is_featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const iconOptions = [
    { value: 'Code', label: 'Code' },
    { value: 'Zap', label: 'Zap' },
    { value: 'BookOpen', label: 'Book Open' },
    { value: 'Lightbulb', label: 'Lightbulb' },
    { value: 'Database', label: 'Database' },
    { value: 'Cloud', label: 'Cloud' },
    { value: 'Smartphone', label: 'Smartphone' },
    { value: 'Award', label: 'Award' },
    { value: 'Users', label: 'Users' },
  ];

  const categoryOptions = [
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'research', label: 'Research' },
    { value: 'tools', label: 'Tools' },
    { value: 'database', label: 'Database' },
    { value: 'cloud', label: 'Cloud' },
    { value: 'mobile', label: 'Mobile' },
  ];

  const proficiencyLevels = [
    { value: 1, label: 'Novice' },
    { value: 2, label: 'Beginner' },
    { value: 3, label: 'Intermediate' },
    { value: 4, label: 'Advanced' },
    { value: 5, label: 'Expert' },
  ];

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        category: skill.category,
        technologies: skill.technologies.join(', '),
        icon: skill.icon,
        proficiency_level: skill.proficiency_level,
        years_experience: skill.years_experience,
        description: skill.description,
        is_featured: skill.is_featured,
      });
    }
  }, [skill]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const technologiesArray = formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech.length > 0);

      const skillData = {
        name: formData.name,
        category: formData.category,
        technologies: technologiesArray,
        icon: formData.icon,
        proficiency_level: formData.proficiency_level,
        years_experience: formData.years_experience,
        description: formData.description,
        is_featured: formData.is_featured,
      };

      if (skill) {
        const { error } = await supabase
          .from('skills')
          .update(skillData)
          .eq('id', skill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('skills')
          .insert([skillData]);
        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save skill');
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
            {skill ? 'Edit Skill' : 'Add New Skill'}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {skill ? 'Update skill details' : 'Add a new skill to your expertise'}
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
          {/* Name and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Skill Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Frontend Development"
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
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon and Proficiency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Icon *
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Proficiency Level *
              </label>
              <select
                value={formData.proficiency_level}
                onChange={(e) => setFormData(prev => ({ ...prev, proficiency_level: parseInt(e.target.value) }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              >
                {proficiencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.value} - {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Years Experience and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Years of Experience *
              </label>
              <input
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData(prev => ({ ...prev, years_experience: parseInt(e.target.value) || 1 }))}
                required
                min="1"
                max="20"
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-5 h-5 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Featured Skill
                </span>
              </label>
            </div>
          </div>

          {/* Technologies */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Technologies *
            </label>
            <input
              type="text"
              value={formData.technologies}
              onChange={(e) => setFormData(prev => ({ ...prev, technologies: e.target.value }))}
              required
              className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="React, Next.js, TypeScript, Tailwind CSS"
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              Separate technologies with commas
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={4}
              className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Describe your expertise in this skill area..."
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
              <span>{skill ? 'Update Skill' : 'Add Skill'}</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default SkillForm;