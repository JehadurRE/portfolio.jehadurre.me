import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Research from '../components/Research';
import Certifications from '../components/Certifications';
import Blog from '../components/Blog';
import Contact from '../components/Contact';

const Home: React.FC = () => {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Research />
      <Certifications />
      <Blog />
      <Contact />
    </main>
  );
};

export default Home;
