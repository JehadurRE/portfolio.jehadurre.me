import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, User, Briefcase, BookOpen, Award, MessageSquare } from 'lucide-react';

// ⚡ Bolt Performance Optimization:
// Move static array outside component function body to prevent recreation on every render.
const navItems = [
  { id: 'hero', icon: Home, label: 'Home', href: '#hero' },
  { id: 'about', icon: User, label: 'About', href: '#about' },
  { id: 'projects', icon: Briefcase, label: 'Projects', href: '#projects' },
  { id: 'research', icon: BookOpen, label: 'Research', href: '#research' },
  { id: 'certifications', icon: Award, label: 'Certs', href: '#certifications' },
  { id: 'contact', icon: MessageSquare, label: 'Contact', href: '#contact' },
];

const MobileNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');

  // ⚡ Bolt Performance Optimization:
  // Throttling the scroll event with requestAnimationFrame and removing synchronous DOM querying/layout recalculations.
  // Using getElementById is faster than querySelector, and passive event listeners avoid blocking the main thread.
  // We also break early out of the loop once we find the matching section.
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY + 100;

          for (let i = 0; i < navItems.length; i++) {
            // Remove the '#' to use getElementById
            const sectionId = navItems[i].href.substring(1);
            const section = document.getElementById(sectionId);

            if (section) {
              const sectionTop = section.offsetTop;
              const sectionBottom = sectionTop + section.offsetHeight;

              if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                setActiveSection(navItems[i].id);
                break; // Break early since we found our section
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNavClick = (href: string, id: string) => {
    setActiveSection(id);
  };

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="glass-card m-4 rounded-2xl p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              onClick={() => handleNavClick(item.href, item.id)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
                activeSection === item.id
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-secondary-600 dark:text-secondary-300 hover:bg-secondary-100 dark:hover:bg-secondary-800'
              }`}
            >
              <item.icon className="w-4 h-4 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
              
              {/* Active indicator */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 bg-primary-500 dark:bg-white rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default MobileNav;