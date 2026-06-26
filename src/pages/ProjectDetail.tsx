import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Calendar,
  ArrowLeft,
  FileText,
} from "lucide-react";
import MarkdownRenderer from "../utils/MarkdownRenderer";
import decodeBase64UTF8 from "../utils/DecodeUTF";
import { formatDate } from "../utils/dateUtils";
import LazyImage from "../components/LazyImage";

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

const getGithubOGImage = (owner: string, name: string) => {
  return `https://opengraph.githubassets.com/1/${owner}/${name}`;
};

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [readme, setReadme] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!slug) return;
      setLoading(true);
      setError(null);

      try {
        // Fetch project metadata
        const projectRes = await fetch(
          `https://api.github.com/repos/JehadurRE/${slug}`
        );
        if (!projectRes.ok) {
          throw new Error("Project not found");
        }
        const projectData: Project = await projectRes.json();
        setProject(projectData);

        // Fetch README
        const readmeRes = await fetch(
          `https://api.github.com/repos/JehadurRE/${slug}/readme`,
          {
            headers: {
              Accept: "application/vnd.github.v3+json",
            },
          }
        );

        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          setReadme(decodeBase64UTF8(readmeData.content));
        } else {
          // If no readme, that's okay, maybe they don't have one
          setReadme("");
        }
      } catch (err: unknown) {
        console.error("Error fetching project details:", err);
        setError("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent"></div>
          <p className="text-secondary-600 dark:text-secondary-300">
            Loading project...
          </p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            {error || "Project not found"}
          </h2>
          <Link
            to="/#projects"
            className="text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  const seoTitle = `${project.name} - Project Overview | Jehad Urre`;
  const seoDescription = project.description || `View details about the ${project.name} project by Jehad Urre.`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "name": project.name,
    "description": project.description,
    "codeRepository": project.html_url,
    "programmingLanguage": project.language,
    "dateModified": project.updated_at,
    "author": {
      "@type": "Person",
      "name": "Jehad Urre",
      "url": "https://jehadurre.me"
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-16 bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={getGithubOGImage(project.owner.login, project.name)} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/#projects"
            className="inline-flex items-center space-x-2 text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-md"
            aria-label="Back to projects"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Projects</span>
          </Link>

          <header className="mb-12">
            <LazyImage
              src={getGithubOGImage(project.owner.login, project.name)}
              alt={`${project.name} preview`}
              containerClassName="w-full h-64 md:h-96 rounded-2xl shadow-xl mb-8"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/1200x630/6366f1/ffffff?text=${encodeURIComponent(
                  project.name
                )}`;
              }}
            />

            <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 dark:text-white mb-6 text-gradient">
              {project.name}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-secondary-600 dark:text-secondary-400 mb-8">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">{project.stargazers_count} stars</span>
              </div>
              <div className="flex items-center space-x-2">
                <GitFork className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{project.forks_count} forks</span>
              </div>
              {project.language && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="font-medium">{project.language}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-accent-500" />
                <span>Updated {formatDate(project.updated_at)}</span>
              </div>
            </div>

            {project.topics && project.topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {project.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 text-sm bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <motion.a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center space-x-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <Github className="w-5 h-5" />
                <span>View Source</span>
              </motion.a>
              {project.homepage && (
                <motion.a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 font-medium rounded-xl hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 inline-flex items-center space-x-2"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>Live Demo</span>
                </motion.a>
              )}
            </div>
          </header>

          <div className="glass-card p-6 md:p-10 rounded-2xl">
            {readme ? (
              <div className="prose prose-lg max-w-none dark:prose-invert text-secondary-700 dark:text-secondary-300 leading-relaxed">
                <MarkdownRenderer
                  markdown={readme}
                  githubUrl={`https://github.com/${project.owner.login}/${project.name}`}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-secondary-400 dark:text-secondary-600 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-secondary-400 text-lg">
                  No README.md found for this project.
                </p>
                <p className="mt-4 text-secondary-500 dark:text-secondary-500">
                  {project.description}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </article>
    </main>
  );
};

export default ProjectDetail;
