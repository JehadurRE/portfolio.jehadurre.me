import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  X,
  Eye,
  FileText,
} from "lucide-react";
import MarkdownRenderer from "../utils/MarkdownRenderer";

import decodeBase64UTF8 from "../utils/DecodeUTF";

interface Project {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
  updated_at: string;
  owner: {
    login: string;
  };
}

interface ProjectModal {
  project: Project;
  readme: string;
  loading: boolean;
}

const Projects: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectModal | null>(
    null
  );

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/JehadurRE/repos?sort=updated&per_page=50"
        );
        const data = await response.json();

        // Filter projects with #portfolio topic or significant projects
        const filteredProjects = data
          .filter(
            (repo: Project) =>
              repo.topics?.includes("jehadurre") ||
              repo.stargazers_count > 0 ||
              repo.forks_count > 0 ||
              repo.description?.toLowerCase().includes("portfolio") ||
              ["javascript", "typescript", "python", "react"].includes(
                repo.language?.toLowerCase()
              )
          )
          .slice(0, 12);

        setProjects(filteredProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback projects
        setProjects([
          {
            id: 1,
            name: "Portfolio Website",
            description:
              "Modern portfolio website built with React, TypeScript, and Framer Motion",
            html_url: "https://github.com/JehadurRE/portfolio",
            homepage: "https://jehadur.dev",
            stargazers_count: 15,
            forks_count: 3,
            language: "TypeScript",
            topics: ["portfolio", "react", "typescript"],
            updated_at: "2024-01-15T00:00:00Z",
            owner: { login: "JehadurRE" },
          },
          {
            id: 2,
            name: "Research Management System",
            description:
              "Full-stack application for managing research papers and collaborations",
            html_url: "https://github.com/JehadurRE/research-system",
            stargazers_count: 8,
            forks_count: 2,
            language: "JavaScript",
            topics: ["research", "nodejs", "mongodb"],
            updated_at: "2024-01-10T00:00:00Z",
            owner: { login: "JehadurRE" },
          },
          {
            id: 3,
            name: "Machine Learning Toolkit",
            description:
              "Collection of ML algorithms and data preprocessing utilities",
            html_url: "https://github.com/JehadurRE/ml-toolkit",
            stargazers_count: 12,
            forks_count: 5,
            language: "Python",
            topics: ["machine-learning", "python", "data-science"],
            updated_at: "2024-01-05T00:00:00Z",
            owner: { login: "JehadurRE" },
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const fetchReadme = async (project: Project) => {
    console.log("Fetching README for:", project.name);

    setSelectedProject({
      project,
      readme: "",
      loading: true,
    });

    try {
      // Try to fetch README from GitHub API
      const response = await fetch(
        `https://api.github.com/repos/${project.owner.login}/${project.name}/readme`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const readmeContent = decodeBase64UTF8(data.content);
        console.log("README fetched successfully");
        setSelectedProject((prev) =>
          prev
            ? {
                ...prev,
                readme: readmeContent,
                loading: false,
              }
            : null
        );
      } else {
        throw new Error(`GitHub API responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching README:", error);
      // Fallback README content
      const fallbackReadme = `# ${project.name}

${project.description || "No description available"}

## Overview

This is a ${
        project.language || "software"
      } project that demonstrates various programming concepts and best practices.

## Features

- Modern architecture and clean code
- Well-structured and maintainable codebase
- Comprehensive documentation
- Following industry best practices

## Technologies Used

${
  project.topics && project.topics.length > 0
    ? project.topics.map((topic) => `- ${topic}`).join("\n")
    : "- Modern development stack"
}

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Git
- ${
        project.language === "JavaScript" || project.language === "TypeScript"
          ? "Node.js and npm"
          : project.language || "Required runtime"
      }

### Installation

1. Clone the repository:
\`\`\`bash
git clone ${project.html_url}
cd ${project.name}
\`\`\`

2. Install dependencies:
\`\`\`bash
${
  project.language === "JavaScript" || project.language === "TypeScript"
    ? "npm install"
    : "# Install dependencies as per project requirements"
}
\`\`\`

3. Run the project:
\`\`\`bash
${
  project.language === "JavaScript" || project.language === "TypeScript"
    ? "npm start"
    : "# Run the project as per instructions"
}
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

For any questions or suggestions, feel free to reach out:
- GitHub: [@${project.owner.login}](https://github.com/${project.owner.login})
- Email: emran.jehadur@gmail.com

---

⭐ If you found this project helpful, please give it a star!`;

      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              readme: fallbackReadme,
              loading: false,
            }
          : null
      );
    }
  };

  const getGithubOGImage = (project: Project) => {
    return `https://opengraph.githubassets.com/1/${project.owner.login}/${project.name}`;
  };

  const languages = [
    "all",
    ...new Set(projects.map((p) => p.language).filter(Boolean)),
  ];
  const filteredProjects =
    filter === "all" ? projects : projects.filter((p) => p.language === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <section id="projects" className="section-padding bg-transparent">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gradient">
            Featured Projects
          </h2>
          <p className="text-lg text-secondary-600 dark:text-secondary-300 max-w-3xl mx-auto">
            A collection of my work showcasing various technologies and
            problem-solving approaches
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {languages.map((lang) => (
            <motion.button
              key={lang}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(lang)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                filter === lang
                  ? "bg-primary-500 text-white shadow-lg"
                  : "glass-card text-secondary-600 dark:text-secondary-300 hover:shadow-md"
              }`}
            >
              {lang === "all" ? "All" : lang}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-48 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
                <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
                <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded mb-2"></div>
                <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                  <div className="h-8 w-16 bg-secondary-200 dark:bg-secondary-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="glass-card p-6 hover:shadow-xl transition-all duration-300 group"
              >
                {/* GitHub OG Image */}
                <div
                  className="relative mb-4 overflow-hidden rounded-lg cursor-pointer group/image"
                  onClick={() => fetchReadme(project)}
                >
                  <img
                    src={getGithubOGImage(project)}
                    alt={`${project.name} preview`}
                    className="w-full h-48 object-cover group-hover/image:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback image if GitHub OG image fails
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/400x200/6366f1/ffffff?text=${encodeURIComponent(
                        project.name
                      )}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex items-center space-x-2 text-white">
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View README</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {project.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-secondary-500 dark:text-secondary-400">
                    <Star className="w-4 h-4" />
                    <span>{project.stargazers_count}</span>
                    <GitFork className="w-4 h-4" />
                    <span>{project.forks_count}</span>
                  </div>
                </div>

                <p className="text-secondary-600 dark:text-secondary-300 mb-4 leading-relaxed">
                  {project.description || "No description available"}
                </p>

                {/* Topics */}
                {project.topics && project.topics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 text-xs bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                {/* Language and Date */}
                <div className="flex items-center justify-between mb-4 text-sm text-secondary-500 dark:text-secondary-400">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                    <span>{project.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(project.updated_at)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <motion.a
                    href={project.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>Code</span>
                  </motion.a>
                  {project.homepage && (
                    <motion.a
                      href={project.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Live</span>
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <motion.a
            href="https://github.com/JehadurRE"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Github className="w-5 h-5" />
            <span>View All Projects</span>
          </motion.a>
        </motion.div>

        {/* README Modal */}
        <AnimatePresence>
          {selectedProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/20 dark:bg-black/20 backdrop-blur-sm"
              onClick={() => setSelectedProject(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="glass-card p-8 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-secondary-200 dark:border-secondary-700">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-primary-500" />
                    <div>
                      <h3 className="text-xl font-bold text-secondary-800 dark:text-secondary-200">
                        {selectedProject.project.name}
                      </h3>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        README.md
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <motion.a
                      href={selectedProject.project.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-3 py-2 bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      <span>View on GitHub</span>
                    </motion.a>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedProject(null)}
                      className="p-2 rounded-full glass-card hover:shadow-lg transition-all duration-200"
                    >
                      <X className="w-5 h-5 text-secondary-600 dark:text-secondary-300" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  {selectedProject.loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
                      <p className="text-secondary-600 dark:text-secondary-300">
                        Loading README...
                      </p>
                    </div>
                  ) : (
                    <div className="prose prose-lg max-w-none dark:prose-invert text-secondary-700 dark:text-secondary-300 leading-relaxed">
                      <MarkdownRenderer
                        markdown={selectedProject.readme}
                        githubUrl={`https://github.com/${selectedProject.project.owner.login}/${selectedProject.project.name}`}
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Projects;
