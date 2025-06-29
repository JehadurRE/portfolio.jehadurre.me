import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Star, Code, Zap, BookOpen, Lightbulb, Database, Cloud, Smartphone, Award, Users } from 'lucide-react';
import { supabase, type Skill } from '../../lib/supabase';
import SkillForm from './SkillForm';

const SkillManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [filter, setFilter] = useState<'all' | 'frontend' | 'backend' | 'research' | 'tools' | 'database' | 'cloud' | 'mobile'>('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('proficiency_level', { ascending: false });

      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchSkills();
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const filteredSkills = skills.filter(skill => {
    if (filter === 'all') return true;
    return skill.category === filter;
  });

  const getIconComponent = (iconName: string) => {
    const icons: { [key: string]: any } = {
      Code,
      Zap,
      BookOpen,
      Lightbulb,
      Database,
      Cloud,
      Smartphone,
      Award,
      Users
    };
    return icons[iconName] || Code;
  };

  const getProficiencyColor = (level: number) => {
    switch (level) {
      case 5: return 'from-green-500 to-green-600';
      case 4: return 'from-blue-500 to-blue-600';
      case 3: return 'from-yellow-500 to-yellow-600';
      case 2: return 'from-orange-500 to-orange-600';
      case 1: return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getProficiencyText = (level: number) => {
    switch (level) {
      case 5: return 'Expert';
      case 4: return 'Advanced';
      case 3: return 'Intermediate';
      case 2: return 'Beginner';
      case 1: return 'Novice';
      default: return 'Unknown';
    }
  };

  const categories = [
    { id: 'all', name: 'All Skills', count: skills.length },
    { id: 'frontend', name: 'Frontend', count: skills.filter(s => s.category === 'frontend').length },
    { id: 'backend', name: 'Backend', count: skills.filter(s => s.category === 'backend').length },
    { id: 'research', name: 'Research', count: skills.filter(s => s.category === 'research').length },
    { id: 'tools', name: 'Tools', count: skills.filter(s => s.category === 'tools').length },
    { id: 'database', name: 'Database', count: skills.filter(s => s.category === 'database').length },
    { id: 'cloud', name: 'Cloud', count: skills.filter(s => s.category === 'cloud').length },
    { id: 'mobile', name: 'Mobile', count: skills.filter(s => s.category === 'mobile').length },
  ];

  if (showForm) {
    return (
      <SkillForm
        skill={editingSkill}
        onSave={() => {
          setShowForm(false);
          setEditingSkill(null);
          fetchSkills();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingSkill(null);
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
            Skills & Expertise
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage your technical skills and expertise areas
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Skill</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(category.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === category.id
                ? 'bg-primary-500 text-white shadow-lg'
                : 'glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md'
            }`}
          >
            {category.name} ({category.count})
          </motion.button>
        ))}
      </div>

      {/* Skills Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.map((skill, index) => {
            const IconComponent = getIconComponent(skill.icon);
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-br ${getProficiencyColor(skill.proficiency_level)} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
                        {skill.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs rounded-full text-white bg-gradient-to-r ${getProficiencyColor(skill.proficiency_level)}`}>
                          {getProficiencyText(skill.proficiency_level)}
                        </span>
                        {skill.is_featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingSkill(skill);
                        setShowForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4 leading-relaxed">
                  {skill.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-500 dark:text-secondary-400">Experience:</span>
                    <span className="font-medium text-secondary-700 dark:text-secondary-300">
                      {skill.years_experience} years
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-500 dark:text-secondary-400">Category:</span>
                    <span className="font-medium text-secondary-700 dark:text-secondary-300 capitalize">
                      {skill.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-sm text-secondary-500 dark:text-secondary-400 mb-2 block">Technologies:</span>
                    <div className="flex flex-wrap gap-1">
                      {skill.technologies.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                      {skill.technologies.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded-full">
                          +{skill.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredSkills.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
                No skills found
              </h3>
              <p className="text-secondary-500 dark:text-secondary-500">
                {filter === 'all' 
                  ? 'Add your first skill to get started'
                  : `No ${filter} skills available`
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillManager;