import { useState, useEffect, useCallback } from 'react';
import decodeBase64UTF8 from '../utils/DecodeUTF';

export interface Project {
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

export interface ProjectModal {
  project: Project;
  readme: string;
  loading: boolean;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<ProjectModal | null>(null);
  const [readmeCache, setReadmeCache] = useState<Record<number, string>>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/JehadurRE/repos?sort=updated&per_page=50"
        );
        const data = await response.json();

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
      } catch (error: unknown) {
        console.error("Error fetching projects:", error);
        setProjects([
          {
            id: 1,
            name: "Portfolio Website",
            description: "Modern portfolio website built with React, TypeScript, and Framer Motion",
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
            description: "Full-stack application for managing research papers and collaborations",
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
            description: "Collection of ML algorithms and data preprocessing utilities",
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

  const fetchReadme = useCallback(async (project: Project) => {
    if (readmeCache[project.id]) {
      console.log("Using cached README for:", project.name);
      setSelectedProject({
        project,
        readme: readmeCache[project.id],
        loading: false,
      });
      return;
    }

    console.log("Fetching README for:", project.name);

    setSelectedProject({
      project,
      readme: "",
      loading: true,
    });

    try {
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
        setReadmeCache(prev => ({ ...prev, [project.id]: readmeContent }));
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
    } catch (error: unknown) {
      console.error("Error fetching README:", error);
      const fallbackReadme = `# ${project.name}\n\n${project.description || "No description available"}\n\n## Overview\n\nThis is a ${project.language || "software"} project that demonstrates various programming concepts and best practices.\n\n## Features\n\n- Modern architecture and clean code\n- Well-structured and maintainable codebase\n- Comprehensive documentation\n- Following industry best practices\n\n## Technologies Used\n\n${project.topics && project.topics.length > 0 ? project.topics.map((topic) => `- ${topic}`).join("\n") : "- Modern development stack"}\n\n## Getting Started\n\n### Prerequisites\n\nMake sure you have the following installed:\n- Git\n- ${project.language === "JavaScript" || project.language === "TypeScript" ? "Node.js and npm" : project.language || "Required runtime"}\n\n### Installation\n\n1. Clone the repository:\n\`\`\`bash\ngit clone ${project.html_url}\ncd ${project.name}\n\`\`\`\n\n2. Install dependencies:\n\`\`\`bash\n${project.language === "JavaScript" || project.language === "TypeScript" ? "npm install" : "# Install dependencies as per project requirements"}\n\`\`\`\n\n3. Run the project:\n\`\`\`bash\n${project.language === "JavaScript" || project.language === "TypeScript" ? "npm start" : "# Run the project as per instructions"}\n\`\`\`\n\n## Contributing\n\nContributions are welcome! Please feel free to submit a Pull Request.\n\n## License\n\nThis project is open source and available under the [MIT License](LICENSE).\n\n## Contact\n\nFor any questions or suggestions, feel free to reach out:\n- GitHub: [@${project.owner.login}](https://github.com/${project.owner.login})\n- Email: emran.jehadur@gmail.com\n\n---\n\n⭐ If you found this project helpful, please give it a star!`;
      setReadmeCache(prev => ({ ...prev, [project.id]: fallbackReadme }));
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
  }, [readmeCache, setReadmeCache, setSelectedProject]);

  return { projects, loading, selectedProject, setSelectedProject, fetchReadme, readmeCache, setReadmeCache };
};
