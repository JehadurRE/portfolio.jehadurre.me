import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, ExternalLink, Users, Calendar, Award } from 'lucide-react';

const Research: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const publications = [
    {
      id: 1,
      title: 'Edge-Fog-Cloud Based Hierarchical Communication Network for Traffic Management System',
      authors: ['Md. Jehad', 'Md. Jobairul Hassan', 'Yousuf Hossen', 'Chondromollika Ahmed', 'Shamim Akhter'],
      venue: 'Visual Sensing and Ubiquitous Computing',
      year: 2024,
      type: 'Book Chapter',
      abstract: 'This paper aims to investigate a real-time hierarchical communication network for traffic management systems. The suggested management program would provide effective, cost-efficient, and secure solutions to critical issues such as authentication, hierarchical processing, reduced latency, overtaking judgments, speed adjustments, and accident notifications. We describe the design stages for creating a prototype, dividing the traffic-related decision-making system into three layers (Edge, Fog and Cloud), establishing a security protocol, and comparing the performance of Edge-Cloud and Edge-Fog-Cloud-based communication networks in this article. The proposed communication network has been discovered to be more efficient and quicker, making it an excellent alternative for real-time traffic safety applications.',
      link: 'https://www.researchgate.net/publication/390932306_Edge-Fog-Cloud_Based_Hierarchical_Communication_Network_for_Traffic_Management_System',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Scalable Web Applications: A Performance Analysis',
      authors: ['Md. Jehadur Rahman Emran', 'Research Collaborator'],
      venue: 'Journal of Web Engineering',
      year: 2023,
      type: 'Journal Article',
      abstract: 'An extensive analysis of performance optimization techniques for modern web applications, including case studies and benchmarking results.',
      link: 'https://scholar.google.com/citations?user=xfSa-0oAAAAJ&hl=en',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Human-Computer Interaction in Educational Technology',
      authors: ['Md. Jehadur Rahman Emran', 'Education Researcher'],
      venue: 'International Journal of Educational Technology',
      year: 2023,
      type: 'Journal Article',
      abstract: 'Exploring the intersection of HCI principles and educational technology to enhance learning experiences in digital environments.',
      link: 'https://scholar.google.com/citations?user=xfSa-0oAAAAJ&hl=en',
      status: 'Published'
    },
    {
      id: 4,
      title: 'Blockchain Applications in Academic Research Management',
      authors: ['Md. Jehadur Rahman Emran', 'Blockchain Researcher'],
      venue: 'Future Generation Computer Systems',
      year: 2024,
      type: 'Journal Article',
      abstract: 'Investigating the potential of blockchain technology for managing academic research data, ensuring transparency and immutability.',
      link: 'https://scholar.google.com/citations?user=xfSa-0oAAAAJ&hl=en',
      status: 'Under Review'
    }
  ];

  const researchAreas = [
    {
      title: 'Machine Learning',
      description: 'Developing ML models for software engineering and data analysis',
      icon: '🤖',
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
    },
    {
      title: 'Web Engineering',
      description: 'Performance optimization and scalability in web applications',
      icon: '🌐',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
    },
    {
      title: 'Human-Computer Interaction',
      description: 'User experience design and interaction patterns',
      icon: '👥',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
    },
    {
      title: 'Educational Technology',
      description: 'Technology-enhanced learning and digital education',
      icon: '📚',
      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
    }
  ];

  return (
    <section id="research" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Research & Publications
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Exploring the intersection of technology and research to advance our understanding 
            of computer science and software engineering
          </p>
        </motion.div>

        {/* Research Areas */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {researchAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="glass-card p-6 text-center hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-secondary-800 dark:text-secondary-200">
                {area.title}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                {area.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Publications */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8 text-secondary-800 dark:text-secondary-200">
            Recent Publications
          </h3>
          
          {publications.map((publication, index) => (
            <motion.div
              key={publication.id}
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-xl font-bold text-secondary-800 dark:text-secondary-200">
                      {publication.title}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      publication.status === 'Published' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {publication.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-secondary-600 dark:text-secondary-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{publication.authors.join(', ')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{publication.year}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{publication.type}</span>
                    </div>
                  </div>
                  
                  <p className="text-accent-600 dark:text-accent-400 font-medium mb-3">
                    {publication.venue}
                  </p>
                  
                  <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed">
                    {publication.abstract}
                  </p>
                </div>
                
                <motion.a
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 lg:mt-0 lg:ml-6 btn-primary inline-flex items-center space-x-2 self-start"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View Paper</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Research Links */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h3 className="text-xl font-semibold mb-6 text-secondary-800 dark:text-secondary-200">
            Research Profiles
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a
              href="https://scholar.google.com/citations?user=xfSa-0oAAAAJ&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <Award className="w-5 h-5" />
              <span>Google Scholar</span>
            </motion.a>
            <motion.a
              href="https://www.researchgate.net/profile/Md-Jehad"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <BookOpen className="w-5 h-5" />
              <span>ResearchGate</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Research;