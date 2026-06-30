import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Send, MapPin, Phone, Mail, Github, Linkedin, Twitter } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(1, 'Message is required').max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

// ⚡ Bolt Performance Optimization:
// Move static arrays outside component function body to prevent recreation on every render.
const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'emran.jehadur@gmail.com',
    href: 'mailto:emran.jehadur@gmail.com'
  },
  {
    icon: MapPin,
    label: 'Location',
    value: 'Available for Remote Work',
    href: null
  },
  {
    icon: Phone,
    label: 'Availability',
    value: 'Open to Opportunities',
    href: null
  }
];
// ⚡ Bolt Performance Optimization:
// Hoist static `TypeAnimation` sequence arrays outside the component body to prevent recreation on every render.
const contactSequence = [
  "initialize contact_form",
  1000,
];


const socialLinks = [
  { icon: Github, href: 'https://github.com/JehadurRE', label: 'GitHub' },
  { icon: Linkedin, href: 'https://www.linkedin.com/in/jehadurre', label: 'LinkedIn' },
  { icon: Twitter, href: 'https://x.com/JehadurRE', label: 'Twitter' },
];

const Contact: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState<number>(0);

  const onSubmit = async (data: ContactFormData) => {
    const now = Date.now();
    const cooldownPeriod = 60 * 1000; // 60 seconds

    if (now - lastSubmissionTime < cooldownPeriod) {
      // Cooldown not yet expired
      const remainingSeconds = Math.ceil((cooldownPeriod - (now - lastSubmissionTime)) / 1000);
      toast.error(`Please wait ${remainingSeconds} seconds before sending another message.`);
      return;
    }

    try {
      // Dummy Service/Template/User IDs for now
      // Replace these with actual IDs when configuring EmailJS
      await emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: data.name,
          reply_to: data.email,
          subject: data.subject,
          message: data.message,
        },
        'YOUR_PUBLIC_KEY'
      );

      setSubmitted(true);
      setLastSubmissionTime(now);
      toast.success('Message sent successfully!');

      // Reset form after success message
      setTimeout(() => {
        setSubmitted(false);
        reset();
      }, 3000);
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send message. Please try again later.');
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 id="contact-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Get In Touch with Jehad Urre
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            Ready to collaborate on your next project or discuss research opportunities? 
            Let's connect and build something amazing together.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-secondary-800 dark:text-secondary-200 mb-6">
                Let's Connect
              </h3>
              <p className="text-secondary-600 dark:text-secondary-300 leading-relaxed mb-8">
                I'm always interested in discussing new projects, research opportunities, 
                or just having a conversation about technology and innovation. Feel free 
                to reach out through any of the channels below.
              </p>
            </div>

            {/* Contact Info */}
            <address className="not-italic space-y-4">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-4 p-4 glass-card hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                    <info.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800 dark:text-secondary-200">
                      {info.label}
                    </h4>
                    {info.href ? (
                      <a
                        href={info.href}
                        className="text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <p className="text-secondary-600 dark:text-secondary-300">
                        {info.value}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </address>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h4 className="font-semibold text-secondary-800 dark:text-secondary-200 mb-4">
                Follow Me
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="glass-card p-3 hover:shadow-lg transition-all duration-300"
                    aria-label={link.label}
                  >
                    <link.icon className="w-6 h-6 text-secondary-600 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Terminal-style Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass-card p-8"
          >
            <div className="bg-secondary-900 dark:bg-black rounded-lg p-6 font-mono text-sm">
              {/* Terminal Header */}
              <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-secondary-700">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-secondary-400">contact@jehadur.dev</span>
              </div>

              {/* Terminal Content */}
              <div className="space-y-2 min-h-[400px]">
                <div className="text-green-400">
                  $ <TypeAnimation
                    sequence={contactSequence}
                    wrapper="span"
                    speed={50}
                    cursor={false}
                  />
                </div>
                
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400"
                  >
                    <div>✅ Message sent successfully!</div>
                    <div>📧 I'll get back to you soon.</div>
                    <div>$ <span className="terminal-cursor">_</span></div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label htmlFor="name" className="text-green-400 block mb-1">$ enter_name:</label>
                      <input
                        id="name"
                        type="text"
                        {...register('name')}
                        maxLength={100}
                        className="w-full bg-transparent text-white border-none outline-none placeholder-secondary-500"
                        placeholder="Your name..."
                      />
                      {errors.name && (
                        <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="text-green-400 block mb-1">$ enter_email:</label>
                      <input
                        id="email"
                        type="email"
                        {...register('email')}
                        maxLength={255}
                        className="w-full bg-transparent text-white border-none outline-none placeholder-secondary-500"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="subject" className="text-green-400 block mb-1">$ enter_subject:</label>
                      <input
                        id="subject"
                        type="text"
                        {...register('subject')}
                        maxLength={200}
                        className="w-full bg-transparent text-white border-none outline-none placeholder-secondary-500"
                        placeholder="What's this about?"
                      />
                      {errors.subject && (
                        <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="message" className="text-green-400 block mb-1">$ enter_message:</label>
                      <textarea
                        id="message"
                        {...register('message')}
                        maxLength={2000}
                        rows={4}
                        className="w-full bg-transparent text-white border-none outline-none placeholder-secondary-500 resize-none"
                        placeholder="Your message here..."
                      />
                      {errors.message && (
                        <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>$ send_message</span>
                        </>
                      )}
                    </motion.button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;