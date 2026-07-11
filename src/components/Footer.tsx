import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, ExternalLink, MapPin, Phone, HeartOff, RefreshCw } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import LazyImage from './LazyImage';
import { subscribeToNewsletter } from '../lib/supabase';
import { toast } from 'sonner';

// ⚡ Bolt Performance Optimization:
// Move static arrays outside component function body to prevent recreation on every render.
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

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const [email, setEmail] = React.useState('');
  const [isSubscribing, setIsSubscribing] = React.useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email is required');
      return;
    }
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsSubscribing(true);
    const result = await subscribeToNewsletter(email);
    setIsSubscribing(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Successfully subscribed to the newsletter!');
      setEmail('');
    }
  };

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
              <LazyImage
                src="https://github.com/JehadurRE.png"
                alt="Jehadur Rahman Emran"
                containerClassName="w-12 h-12 rounded-full ring-2 ring-primary-500/20"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                width={48}
                height={48}
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
                  rel="noopener noreferrer me"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="glass-card p-3 hover:shadow-lg transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-xl"
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
                    href={isHome ? link.href : `/${link.href}`}
                    whileHover={{ x: 5 }}
                    className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors duration-200 flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
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
                  className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
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
                onSubmit={handleNewsletterSubmit}
              >
                <input
                  type="email"
                  maxLength={255}
                  placeholder="Your email"
                  aria-label="Email address for newsletter"
                  className="flex-1 px-3 py-2 text-sm rounded-lg glass border border-secondary-600 dark:border-secondary-700 text-white dark:text-secondary-200 placeholder-secondary-400 dark:placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  value={email}
                  disabled={isSubscribing}
                  onChange={e => setEmail(e.target.value)}
                />
                <motion.button
                  type="submit"
                  whileHover={!isSubscribing ? { scale: 1.05 } : {}}
                  whileTap={!isSubscribing ? { scale: 0.95 } : {}}
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[90px]"
                  aria-label="Subscribe to newsletter"
                >
                  {isSubscribing ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    'Subscribe'
                  )}
                </motion.button>
              </form>
              <p className="text-[10px] text-secondary-400 mt-2">
                By subscribing, you agree to receive updates. No spam, ever.
              </p>
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
              <small className="flex items-center space-x-2">
                <span>© {currentYear} Md. Jehadur Rahman Emran. Made with</span>
                <HeartOff className="w-4 h-4 text-rose-900 fill-current" />
                <span>and lots of ☕</span>
              </small>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                Privacy Policy
              </motion.a>
              <motion.a
                href="/"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
              >
                Terms of Service
              </motion.a>
              <motion.a
                href="/admin"
                aria-label="Admin link"
                whileHover={{ scale: 1.05 }}
                className="text-secondary-300 dark:text-secondary-400 hover:text-primary-400 dark:hover:text-primary-400 transition-colors flex items-center space-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded"
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