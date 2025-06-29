import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, ExternalLink } from 'lucide-react';
import { supabase, type Certification } from '../../lib/supabase';
import CertificationForm from './CertificationForm';

const CertificationManager: React.FC = () => {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [filter, setFilter] = useState<'all' | 'technical' | 'professional' | 'academic'>('all');

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('certifications')
        .select('*')
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setCertifications(data || []);
    } catch (error) {
      console.error('Error fetching certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;

    try {
      const { error } = await supabase
        .from('certifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCertifications();
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const filteredCertifications = certifications.filter(cert => {
    if (filter === 'all') return true;
    return cert.category === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (showForm) {
    return (
      <CertificationForm
        certification={editingCert}
        onSave={() => {
          setShowForm(false);
          setEditingCert(null);
          fetchCertifications();
        }}
        onCancel={() => {
          setShowForm(false);
          setEditingCert(null);
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
            Certifications
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400">
            Manage your professional certifications
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-5 h-5" />
          <span>Add Certification</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        {(['all', 'technical', 'professional', 'academic'] as const).map((filterOption) => (
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

      {/* Certifications Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="glass-card p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              {/* Image */}
              <div className="relative mb-4 overflow-hidden rounded-lg">
                <img
                  src={cert.image_url}
                  alt={cert.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${
                    cert.category === 'technical' ? 'bg-blue-500' :
                    cert.category === 'professional' ? 'bg-green-500' : 'bg-purple-500'
                  }`}>
                    {cert.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200">
                  {cert.title}
                </h3>
                
                <p className="text-accent-600 dark:text-accent-400 font-medium">
                  {cert.issuer}
                </p>

                <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(cert.issue_date)}</span>
                  {cert.expiry_date && (
                    <>
                      <span>•</span>
                      <span>Expires {formatDate(cert.expiry_date)}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {cert.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {cert.skills.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded-full">
                      +{cert.skills.length - 3}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <a
                    href={cert.verification_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Verify</span>
                  </a>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setEditingCert(cert);
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
                      onClick={() => handleDelete(cert.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredCertifications.length === 0 && (
            <div className="col-span-full text-center py-16">
              <h3 className="text-lg font-semibold text-secondary-600 dark:text-secondary-400 mb-2">
                No certifications found
              </h3>
              <p className="text-secondary-500 dark:text-secondary-500">
                {filter === 'all' 
                  ? 'Add your first certification to get started'
                  : `No ${filter} certifications available`
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CertificationManager;