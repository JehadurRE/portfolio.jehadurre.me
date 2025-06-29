import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, Phone ,HeartOff} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/JehadurRE', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/jehadurre', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://x.com/JehadurRE', label: 'Twitter' },
    { icon: Mail, href: 'mailto:emran.jehadur@gmail.com', label: 'Email' },
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Research', href: '#research' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact', href: '#contact' },
  ];

  const services = [
    'Full-Stack Development',
    'Research & Development',
    'Technical Consulting',
    'Code Review & Mentoring',
    'System Architecture',
    'Performance Optimization'
  ];

  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  return (
    <footer className="hidden lg:block bg-gradient-to-t from-secondary-900 via-secondary-800 to-transparent dark:from-black dark:via-secondary-900 dark:to-transparent">
      <div className="container-custom px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="flex items-center space-x-3 mb-6">
              <img
                src="https://github.com/JehadurRE.png"
                alt="Jehadur Rahman Emran"
                className="w-12 h-12 rounded-full ring-2 ring-primary-500/20"
              />
              <div>
                <h3 className="text-xl font-bold text-gradient">JehadurRE</h3>
                <p className="text-sm text-secondary-300">Software Engineer</p>
              </div>
            </div>
            <p className="text-secondary-300 dark:text-secondary-400 leading-relaxed mb-6">
              Passionate software engineer with expertise in full-stack development, research, 
              and innovative problem-solving. Building scalable solutions and contributing to 
              academic research.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="glass-card p-3 hover:shadow-lg transition-all duration-300"
                  aria-label={link.label}
                >
                  <link.icon className="w-5 h-5 text-secondary-400 hover:text-primary-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold text-white dark:text-secondary-200 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <motion.a
                    href={link.href}
                    whileHover={{ x: 5 }}
                    className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>→</span>
                    <span>{link.name}</span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-white dark:text-secondary-200 mb-6">
              Services
            </h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span>•</span>
                    <span>{service}</span>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-white dark:text-secondary-200 mb-6">
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <a
                  href="mailto:emran.jehadur@gmail.com"
                  className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors"
                >
                  emran.jehadur@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-300 dark:text-secondary-400">
                  Available for Remote Work
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-secondary-300 dark:text-secondary-400">
                  Open to Opportunities
                </span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-8">
              <h5 className="text-md font-medium text-white dark:text-secondary-200 mb-3">
              Stay Updated
              </h5>
              <form
              className="flex space-x-2"
              onSubmit={e => {
                e.preventDefault();
                if (!email) {
                setError('Email is required');
                } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
                setError('Please enter a valid email');
                } else {
                setError('');
                setSuccess('Subscribed!');
                setEmail('');
                }
              }}
              >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 text-sm rounded-lg glass border border-secondary-600 dark:border-secondary-700 text-white dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={email}
                onChange={e => {
                setEmail(e.target.value);
                setError('');
                setSuccess('');
                }}
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Subscribe
              </motion.button>
              </form>
              {error && (
              <div className="text-xs text-rose-400 mt-2">{error}</div>
              )}
              {success && (
              <div className="text-xs text-green-400 mt-2">{success}</div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 pt-8 border-t border-secondary-700 dark:border-secondary-800"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-2 text-secondary-300 dark:text-secondary-400">
              <span>© {currentYear} Md. Jehadur Rahman Emran. Made with</span>
              <HeartOff className="w-4 h-4 text-rose-900 fill-current" />
              <span>and lots of ☕</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors"
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="/admin"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors flex items-center space-x-1"
              >
                <span>Admin</span>
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;