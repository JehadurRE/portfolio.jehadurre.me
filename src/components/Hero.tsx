import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter, Mail, ExternalLink } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { GoogleScholar } from '../icons/CustomsByJehadurRE'; // Assuming you have a custom icon for Google Scholar


const Hero: React.FC = () => {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/JehadurRE', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/jehadurre', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/JehadurRE', label: 'Twitter' },
    { icon: Mail, href: 'mailto:emran.jehadur@gmail.com', label: 'Email' },
    { icon: GoogleScholar, href: 'https://scholar.google.com/citations?user=xfSa-0oAAAAJ&hl=en', label: 'Email' }
  ];

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-accent-300/20 rounded-full blur-3xl animate-float delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-48 h-48 bg-secondary-300/20 rounded-full blur-3xl animate-float delay-2000"></div>
      </div>

      <div className="container-custom section-padding relative z-10">
        <div className="text-center">
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 mx-auto relative"
          >
            <div className="relative w-48 h-48 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 p-1 animate-pulse-slow">
                <div className="w-full h-full rounded-full bg-white dark:bg-secondary-800 p-2">
                  <img
                    src="https://github.com/JehadurRE.png"
                    alt="Md. Jehadur Rahman Emran"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent-400 rounded-full animate-bounce-slow"></div>
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary-400 rounded-full animate-bounce-slow delay-500"></div>
            </div>
          </motion.div>

          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              <span className="text-gradient">Md. Jehadur Rahman</span>
              <br />
              <span className="text-secondary-800 dark:text-secondary-200">Emran</span>
            </h1>
            <div className="text-xl sm:text-2xl text-secondary-600 dark:text-secondary-300 font-medium">
              <TypeAnimation
                sequence={[
                  'Software Engineer',
                  2000,
                  'Researcher',
                  2000,
                  'Full-Stack Developer',
                  2000,
                  'Problem Solver',
                  2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="inline-block"
              />
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg sm:text-xl text-secondary-600 dark:text-secondary-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Passionate software engineer with expertise in full-stack development, research, and 
            innovative problem-solving. Building scalable solutions and contributing to academic research 
            in computer science.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>View My Work</span>
              <ExternalLink className="w-4 h-4" />
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <span>Get In Touch</span>
              <Mail className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center space-x-6 mb-16"
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="glass-card p-3 hover:shadow-lg transition-all duration-300"
                aria-label={link.label}
              >
                <link.icon className="w-6 h-6 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="animate-bounce"
          >
            <a href="#about" className="inline-block">
              <ArrowDown className="w-6 h-6 text-secondary-400 dark:text-secondary-500" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;