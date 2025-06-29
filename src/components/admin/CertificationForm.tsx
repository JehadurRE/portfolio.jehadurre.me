import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, X } from 'lucide-react';
import { supabase, type Certification } from '../../lib/supabase';

interface CertificationFormProps {
  certification?: Certification | null;
  onSave: () => void;
  onCancel: () => void;
}

const CertificationForm: React.FC<CertificationFormProps> = ({ certification, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issue_date: '',
    expiry_date: '',
    credential_id: '',
    verification_url: '',
    image_url: '',
    description: '',
    skills: '',
    category: 'technical' as 'technical' | 'professional' | 'academic',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (certification) {
      setFormData({
        title: certification.title,
        issuer: certification.issuer,
        issue_date: certification.issue_date,
        expiry_date: certification.expiry_date || '',
        credential_id: certification.credential_id,
        verification_url: certification.verification_url,
        image_url: certification.image_url,
        description: certification.description,
        skills: certification.skills.join(', '),
        category: certification.category,
      });
    }
  }, [certification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const certData = {
        title: formData.title,
        issuer: formData.issuer,
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date || null,
        credential_id: formData.credential_id,
        verification_url: formData.verification_url,
        image_url: formData.image_url,
        description: formData.description,
        skills: skillsArray,
        category: formData.category,
      };

      if (certification) {
        const { error } = await supabase
          .from('certifications')
          .update(certData)
          .eq('id', certification.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('certifications')
          .insert([certData]);
        if (error) throw error;
      }

      onSave();
    } catch (err: any) {
      setError(err.message || 'Failed to save certification');
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
            {certification ? 'Edit Certification' : 'Add New Certification'}
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            {certification ? 'Update certification details' : 'Add a new professional certification'}
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
          {/* Title and Issuer */}
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
                placeholder="AWS Certified Solutions Architect"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Issuer *
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData(prev => ({ ...prev, issuer: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="Amazon Web Services"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Credential ID and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Credential ID *
              </label>
              <input
                type="text"
                value={formData.credential_id}
                onChange={(e) => setFormData(prev => ({ ...prev, credential_id: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="AWS-ASA-2023-001"
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
                <option value="technical">Technical</option>
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
              </select>
            </div>
          </div>

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Verification URL *
              </label>
              <input
                type="url"
                value={formData.verification_url}
                onChange={(e) => setFormData(prev => ({ ...prev, verification_url: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="https://aws.amazon.com/verification"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                required
                className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                placeholder="https://images.pexels.com/..."
              />
            </div>
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
              placeholder="Describe what this certification validates..."
            />
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Skills
            </label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
              className="w-full px-4 py-3 glass border border-secondary-200 dark:border-secondary-700 rounded-xl text-secondary-800 dark:text-secondary-200 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              placeholder="AWS, Cloud Architecture, System Design, Security"
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              Separate skills with commas
            </p>
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
              <span>{certification ? 'Update Certification' : 'Add Certification'}</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CertificationForm;