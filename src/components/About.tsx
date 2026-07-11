import { trackEvent } from '../lib/analytics';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Zap, Users, Award, BookOpen, Lightbulb, Download, Database, Star } from 'lucide-react';
import { skillsApi, type Skill } from '../lib/supabase';
import { getIconComponent, getProficiencyText } from '../utils/skillUtils';
import GithubActivity from './GithubActivity';

// ⚡ Bolt Performance Optimization:
// Move static arrays outside component function body to prevent recreation on every render.
const SKELETON_ITEMS = [1, 2, 3, 4];

const achievements = [
    { icon: Award, title: 'Research Publications', value: '5+' },
    { icon: Code, title: 'Open Source Projects', value: '20+' },
    { icon: Users, title: 'Collaboration Projects', value: '10+' },
  ];

  const CATEGORIES = [
    { id: 'frontend', label: 'Frontend', icon: Code },
    { id: 'backend', label: 'Backend', icon: Zap },
    { id: 'cloud', label: 'DevOps & Cloud', icon: Lightbulb },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'tools', label: 'Tools', icon: Award },
    { id: 'research', label: 'Research', icon: BookOpen },
  ] as const;

  const skillsraw: Skill[] = [
    { id: '1', name: 'React', category: 'frontend', technologies: ['Hooks', 'Context', 'Redux'], icon: 'Code', proficiency_level: 5, years_experience: 4, description: 'Building scalable SPAs', is_featured: true, created_at: '' },
    { id: '2', name: 'TypeScript', category: 'frontend', technologies: ['Types', 'Interfaces', 'Generics'], icon: 'Code', proficiency_level: 4, years_experience: 3, description: 'Type-safe development', is_featured: true, created_at: '' },
    { id: '3', name: 'Node.js', category: 'backend', technologies: ['Express', 'NestJS', 'REST APIs'], icon: 'Zap', proficiency_level: 4, years_experience: 3, description: 'Server-side JavaScript', is_featured: true, created_at: '' },
    { id: '4', name: 'Python', category: 'backend', technologies: ['Django', 'FastAPI', 'Flask'], icon: 'Zap', proficiency_level: 4, years_experience: 3, description: 'Backend and scripting', is_featured: true, created_at: '' },
    { id: '5', name: 'PostgreSQL', category: 'database', technologies: ['SQL', 'Optimization', 'PL/pgSQL'], icon: 'Database', proficiency_level: 4, years_experience: 3, description: 'Relational databases', is_featured: true, created_at: '' },
    { id: '6', name: 'MongoDB', category: 'database', technologies: ['NoSQL', 'Aggregation', 'Mongoose'], icon: 'Database', proficiency_level: 3, years_experience: 2, description: 'Document databases', is_featured: true, created_at: '' },
    { id: '7', name: 'AWS', category: 'cloud', technologies: ['EC2', 'S3', 'Lambda', 'RDS'], icon: 'Cloud', proficiency_level: 3, years_experience: 2, description: 'Cloud infrastructure', is_featured: true, created_at: '' },
    { id: '8', name: 'Docker', category: 'cloud', technologies: ['Containers', 'Compose', 'Dockerfile'], icon: 'Cloud', proficiency_level: 4, years_experience: 3, description: 'Containerization', is_featured: true, created_at: '' },
    { id: '9', name: 'Git', category: 'tools', technologies: ['GitHub', 'GitLab', 'CI/CD'], icon: 'Code', proficiency_level: 5, years_experience: 4, description: 'Version control', is_featured: true, created_at: '' },
    { id: '10', name: 'Machine Learning', category: 'research', technologies: ['PyTorch', 'TensorFlow', 'Scikit-learn'], icon: 'BookOpen', proficiency_level: 3, years_experience: 2, description: 'Data models', is_featured: true, created_at: '' },
  ];



const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState<string>('frontend');

  const displayedSkills = React.useMemo(() => {
    const source = skills.length > 0 ? skills : skillsraw;
    return source.filter(skill => skill.category === activeCategory);
  }, [skills, activeCategory]);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await skillsApi.getFeatured();
      setSkills(data);
    } catch (err: unknown) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);



   



  return (
    <section id="about" aria-labelledby="about-heading" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 id="about-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            About Jehad Urre
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            I'm a passionate software engineer with a strong foundation in both practical development 
            and academic research. My journey spans from building scalable web applications to 
            contributing to computer science research.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold mb-4 text-secondary-800 dark:text-secondary-200">
                My Journey
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-4">
                With a deep passion for technology and research, I've dedicated my career to bridging 
                the gap between theoretical computer science and practical software development. 
                My work spans across multiple domains, from web development to machine learning research.
              </p>
              <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                I believe in the power of open-source collaboration and continuous learning. 
                When I'm not coding, you'll find me exploring new technologies, writing research papers, 
                or contributing to the developer community.
              </p>
            <div className="mt-6">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("download_resume", { location: "about" })}
                className="btn-primary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-lg"
              >
                <span>Download Full Resume / CV</span>
                <Download className="w-4 h-4" />
              </a>
            </div>
            </div>

            {/* Achievements */}
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="glass-card p-4 text-center"
                >
                  <achievement.icon className="w-8 h-8 mx-auto mb-2 text-primary-500" />
                  <div className="text-2xl font-bold text-gradient mb-1">
                    {achievement.value}
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {achievement.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >



            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-6 text-secondary-800 dark:text-secondary-200">
                Skills & Expertise
              </h3>

               {/* Categories Tab Navigation */}
               <div
                  className="flex overflow-x-auto pb-2 scrollbar-hide space-x-2 w-full"
                  role="tablist"
                  aria-label="Skill Categories"
                >
                  {CATEGORIES.map((category) => (
                    <motion.button
                      key={category.id}
                      role="tab"
                      aria-selected={activeCategory === category.id}
                      aria-controls={`panel-${category.id}`}
                      id={`tab-${category.id}`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                        activeCategory === category.id
                          ? 'bg-primary-500 text-white shadow-lg'
                          : 'bg-white/50 dark:bg-secondary-800/50 text-secondary-600 dark:text-secondary-300 hover:bg-white dark:hover:bg-secondary-800'
                      }`}
                    >
                      <category.icon className="w-4 h-4" />
                      <span>{category.label}</span>
                    </motion.button>
                  ))}
                </div>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SKELETON_ITEMS.map((_, i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="flex items-center mb-4">
                       <div className="w-6 h-6 bg-secondary-200 dark:bg-secondary-700 rounded-full mr-3"></div>
                       <div className="h-4 w-24 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                    </div>
                    <div className="h-3 w-32 bg-secondary-200 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="flex space-x-2 mt-4">
                      <div className="h-6 w-16 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
                      <div className="h-6 w-16 bg-secondary-200 dark:bg-secondary-700 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                role="tabpanel"
                id={`panel-${activeCategory}`}
                aria-labelledby={`tab-${activeCategory}`}
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
              >
                 {displayedSkills.map((skill, index) => {
                    const IconComponent = getIconComponent(skill.icon);
                    return (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="glass-card p-5 hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                             <IconComponent className="w-5 h-5 text-primary-500 mr-2" />
                             <h4 className="text-lg font-bold text-secondary-800 dark:text-secondary-200 leading-tight">
                                {skill.name}
                             </h4>
                          </div>
                        </div>

                        {/* Proficiency Stars */}
                        <div
                          className="flex items-center space-x-1 mb-3"
                          aria-label={`Proficiency level: ${skill.proficiency_level} out of 5 - ${getProficiencyText(skill.proficiency_level)}`}
                        >
                           {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= skill.proficiency_level ? 'text-yellow-400 fill-yellow-400' : 'text-secondary-300 dark:text-secondary-600'}`}
                                aria-hidden="true"
                              />
                           ))}
                           <span className="text-xs text-secondary-500 ml-2">
                             {skill.years_experience} yr{skill.years_experience !== 1 && 's'}
                           </span>
                        </div>

                        <div className="flex-grow">
                          <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4 line-clamp-2">
                            {skill.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {skill.technologies.slice(0, 4).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-md whitespace-nowrap"
                            >
                              {tech}
                            </span>
                          ))}
                          {skill.technologies.length > 4 && (
                            <span className="px-2 py-0.5 text-xs bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 rounded-md">
                              +{skill.technologies.length - 4}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    );
                 })}

                 {displayedSkills.length === 0 && (
                   <div className="col-span-full py-8 text-center text-secondary-500 dark:text-secondary-400 glass-card" aria-live="polite" role="status">
                     No skills found in this category.
                   </div>
                 )}
              </motion.div>
            )}
          </motion.div>




        </div>

        {/* GitHub Activity Section */}
        <GithubActivity />

      </div>
    </section>
  );
};

export default About;
