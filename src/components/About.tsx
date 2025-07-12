import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Zap, Users, Award, BookOpen, Lightbulb, Database, Cloud, Smartphone ,CodeXml,Codesandbox} from 'lucide-react';
import { skillsApi, type Skill } from '../lib/supabase';

const About: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [skillsView, setSkillsView] = useState<'compact' | 'detailed'>('compact');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await skillsApi.getFeatured();
        setSkills(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const achievements = [
    { icon: Award, title: 'Research Publications', value: '5+' },
    { icon: Code, title: 'Open Source Projects', value: '20+' },
    { icon: Users, title: 'Collaboration Projects', value: '10+' },
  ];

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
      case 5: return 'bg-green-500';
      case 4: return 'bg-blue-500';
      case 3: return 'bg-yellow-500';
      case 2: return 'bg-orange-500';
      case 1: return 'bg-red-500';
      default: return 'bg-gray-500';
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



   
  // const comaredRenderCommentedOut = () => (
  //             skills.map((skill, index) => {
  //               const IconComponent = getIconComponent(skill.icon);
  //               return (
  //                 <motion.div
  //                   key={skill.id}
  //                   initial={{ opacity: 0, x: 30 }}
  //                   animate={inView ? { opacity: 1, x: 0 } : {}}
  //                   transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
  //                   className="glass-card p-6 hover:shadow-lg transition-all duration-300"
  //                 >
  //                   <div className="flex items-center mb-4">
  //                     <IconComponent className="w-6 h-6 text-primary-500 mr-3" />
  //                     <div className="flex-1">
  //                       <h4 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
  //                         {skill.name}
  //                       </h4>
  //                       <div className="flex items-center space-x-2 mt-1">
  //                         <span className={`px-2 py-1 text-xs rounded-full text-white ${getProficiencyColor(skill.proficiency_level)}`}>
  //                           {getProficiencyText(skill.proficiency_level)}
  //                         </span>
  //                         <span className="text-sm text-secondary-500 dark:text-secondary-400">
  //                           {skill.years_experience} years
  //                         </span>
  //                       </div>
  //                     </div>
  //                   </div>
                    
  //                   <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4">
  //                     {skill.description}
  //                   </p>
                    
  //                   <div className="flex flex-wrap gap-2">
  //                     {skill.technologies.map((tech) => (
  //                       <span
  //                         key={tech}
  //                         className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
  //                       >
  //                         {tech}
  //                       </span>
  //                     ))}
  //                   </div>
  //                 </motion.div>
  //               );
  //             })
  //           )

   const renderDetailedSkills = () => (
    <div className="space-y-6">
      {skills.map((skill, index) => {
        const IconComponent = getIconComponent(skill.icon);
        return (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            className="glass-card p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center mb-4">
              <IconComponent className="w-6 h-6 text-primary-500 mr-3" />
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
                  {skill.name}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 text-xs rounded-full text-white ${getProficiencyColor(skill.proficiency_level)}`}>
                    {getProficiencyText(skill.proficiency_level)}
                  </span>
                  <span className="text-sm text-secondary-500 dark:text-secondary-400">
                    {skill.years_experience} years
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-secondary-600 dark:text-secondary-300 text-sm mb-4">
              {skill.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {skill.technologies.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );


  const skillsraw = [
    { name: 'Frontend', technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'], icon: Code },
    { name: 'Backend', technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB'], icon: Zap },
    { name: 'Research', technologies: ['Machine Learning', 'Data Analysis', 'Academic Writing'], icon: BookOpen },
    { name: 'Tools', technologies: ['Git', 'Docker', 'AWS', 'Supabase'], icon: Lightbulb },
  ];

  const renderCompactSkills = () => (
     <div className='space-y-6 '>
       {skillsraw.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  className="glass-card p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <skill.icon className="w-6 h-6 text-primary-500 mr-3" />
                    <h4 className="text-xl font-semibold text-secondary-800 dark:text-secondary-200">
                      {skill.name}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
     </div>
  )

  return (
    <section id="about" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            About Me
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



            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold mb-6 text-secondary-800 dark:text-secondary-200">
                Skills & Expertise
              </h3>

               {/* View Toggle */}
              <div className="glass-card p-1 rounded-xl">
                <div className="flex space-x-1">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSkillsView('compact')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      skillsView === 'compact'
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                    }`}
                  >
                    <CodeXml className="w-4 h-4" />
                    <span>Compact</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSkillsView('detailed')}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      skillsView === 'detailed'
                        ? 'bg-primary-500 text-white shadow-lg'
                        : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                    }`}
                  >
                    <Codesandbox className="w-4 h-4" />
                    <span>Detailed</span>
                  </motion.button>
                </div>
              </div>
            </div>
            
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Try Again
                </button>
              </div>
            ) : loading ? (
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-card p-6 animate-pulse">
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
                    <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded mb-2"></div>
                    <div className="flex space-x-2">
                      <div className="h-6 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                      <div className="h-6 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                key={skillsView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {skillsView === 'compact' ? renderCompactSkills() : renderDetailedSkills()}
              </motion.div>
            )
            
            
            
            
            }
          </motion.div>




        </div>
      </div>
    </section>
  );
};

export default About;