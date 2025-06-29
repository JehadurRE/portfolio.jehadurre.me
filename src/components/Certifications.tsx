import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Calendar, ExternalLink, Eye, X, Trophy, Medal, Star, CheckCircle } from 'lucide-react';
import { certificationsApi, achievementsApi, type Certification, type Achievement } from '../lib/supabase';

const Certifications: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [activeTab, setActiveTab] = useState<'certifications' | 'achievements'>('certifications');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [certFilter, setCertFilter] = useState('all');
  const [achievementFilter, setAchievementFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [certsData, achievementsData] = await Promise.all([
          certificationsApi.getAll(),
          achievementsApi.getAll()
        ]);
        
        setCertifications(certsData);
        setAchievements(achievementsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const categories = {
    certifications: [
      { id: 'all', name: 'All Certifications', count: certifications.length },
      { id: 'technical', name: 'Technical', count: certifications.filter(c => c.category === 'technical').length },
      { id: 'professional', name: 'Professional', count: certifications.filter(c => c.category === 'professional').length },
      { id: 'academic', name: 'Academic', count: certifications.filter(c => c.category === 'academic').length }
    ],
    achievements: [
      { id: 'all', name: 'All Achievements', count: achievements.length },
      { id: 'award', name: 'Awards', count: achievements.filter(a => a.category === 'award').length },
      { id: 'recognition', name: 'Recognition', count: achievements.filter(a => a.category === 'recognition').length },
      { id: 'milestone', name: 'Milestones', count: achievements.filter(a => a.category === 'milestone').length }
    ]
  };

  const filteredCertifications = certFilter === 'all' 
    ? certifications 
    : certifications.filter(cert => cert.category === certFilter);

  const filteredAchievements = achievementFilter === 'all'
    ? achievements
    : achievements.filter(achievement => achievement.category === achievementFilter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'technical': return <Award className="w-4 h-4" />;
      case 'professional': return <Trophy className="w-4 h-4" />;
      case 'academic': return <Medal className="w-4 h-4" />;
      case 'award': return <Trophy className="w-4 h-4" />;
      case 'recognition': return <Star className="w-4 h-4" />;
      case 'milestone': return <CheckCircle className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  if (error) {
    return (
      <section id="certifications" className="section-padding bg-transparent">
        <div className="container-custom">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
              Certifications & Achievements
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Certifications & Achievements
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Professional certifications, academic achievements, and recognition that validate my expertise 
            and commitment to continuous learning
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <div className="glass-card p-2 rounded-2xl">
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('certifications')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'certifications'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5" />
                  <span>Certifications</span>
                </div>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('achievements')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeTab === 'achievements'
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5" />
                  <span>Achievements</span>
                </div>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-secondary-600 dark:text-secondary-300">Loading...</p>
          </div>
        ) : (
          <>
            {/* Certifications Tab */}
            {activeTab === 'certifications' && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Certification Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-2 mb-12"
                >
                  {categories.certifications.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCertFilter(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        certFilter === category.id
                          ? 'bg-accent-500 text-white shadow-lg'
                          : 'glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md'
                      }`}
                    >
                      {category.name} ({category.count})
                    </motion.button>
                  ))}
                </motion.div>

                {/* Certifications Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredCertifications.map((cert, index) => (
                    <motion.div
                      key={cert.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="glass-card p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer"
                      onClick={() => setSelectedCert(cert)}
                    >
                      {/* Certificate Image */}
                      <div className="relative mb-4 overflow-hidden rounded-lg">
                        <img
                          src={cert.image_url}
                          alt={cert.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div className="absolute top-4 left-4">
                          <div className={`p-2 rounded-lg text-white ${
                            cert.category === 'technical' ? 'bg-blue-500' :
                            cert.category === 'professional' ? 'bg-green-500' : 'bg-purple-500'
                          }`}>
                            {getCategoryIcon(cert.category)}
                          </div>
                        </div>
                      </div>

                      {/* Certificate Info */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
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
                              +{cert.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Achievement Filters */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-2 mb-12"
                >
                  {categories.achievements.map((category) => (
                    <motion.button
                      key={category.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setAchievementFilter(category.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        achievementFilter === category.id
                          ? 'bg-accent-500 text-white shadow-lg'
                          : 'glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md'
                      }`}
                    >
                      {category.name} ({category.count})
                    </motion.button>
                  ))}
                </motion.div>

                {/* Achievements List */}
                <div className="space-y-6">
                  {filteredAchievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-8 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
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
                            <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                              <Calendar className="w-4 h-4" />
                              <span>{formatDate(achievement.date)}</span>
                            </div>
                          </div>
                          
                          <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                            {achievement.details}
                          </p>
                          
                          <div className="mt-4 flex items-center space-x-2">
                            {getCategoryIcon(achievement.category)}
                            <span className="text-sm font-medium text-secondary-500 dark:text-secondary-400 capitalize">
                              {achievement.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Certificate Modal */}
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">
                  {selectedCert.title}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-full glass-card hover:shadow-lg transition-all duration-200"
                >
                  <X className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                </motion.button>
              </div>

              <div className="space-y-6">
                <img
                  src={selectedCert.image_url}
                  alt={selectedCert.title}
                  className="w-full h-64 object-cover rounded-lg"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                      Issuer
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-300">
                      {selectedCert.issuer}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                      Issue Date
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-300">
                      {formatDate(selectedCert.issue_date)}
                    </p>
                  </div>

                  {selectedCert.expiry_date && (
                    <div>
                      <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                        Expiry Date
                      </h4>
                      <p className="text-secondary-600 dark:text-secondary-300">
                        {formatDate(selectedCert.expiry_date)}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                      Credential ID
                    </h4>
                    <p className="text-secondary-600 dark:text-secondary-300 font-mono text-sm">
                      {selectedCert.credential_id}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-2">
                    Description
                  </h4>
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {selectedCert.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-3">
                    Skills Validated
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <motion.a
                  href={selectedCert.verification_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary inline-flex items-center space-x-2 w-full justify-center"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Verify Certificate</span>
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>


    </section>
  );
};

export default Certifications;