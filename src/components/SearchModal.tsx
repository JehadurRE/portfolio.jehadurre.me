import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { blogApi, type BlogPost } from '../lib/supabase';
import './SearchModal.css';

interface GithubProject {
  id: number;
  name: string;
  topics?: string[];
  stargazers_count: number;
}

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<GithubProject[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (open && projects.length === 0) {
      fetch('https://api.github.com/users/JehadurRE/repos?sort=updated&per_page=50')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
                 setProjects(data.filter((repo: GithubProject) => repo.topics?.includes("jehadurre") || repo.stargazers_count > 0));
          }
        })
        .catch(console.error);

      blogApi.getPublished().then(setPosts).catch(console.error);
    }
  }, [open, projects.length]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-full glass-card hover:shadow-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        aria-label="Search"
      >
        <svg className="w-5 h-5 text-secondary-600 dark:text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      <Command.Dialog open={open} onOpenChange={setOpen} label="Global Command Menu" className="cmdk-dialog">
        <Command.Input placeholder="Search projects and blog posts..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          <Command.Group heading="Projects">
            {projects.map((project) => (
              <Command.Item
                key={project.id}
                onSelect={() => {
                  setOpen(false);
                  navigate(`/project/${project.id}`);
                }}
              >
                {project.name}
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Blog Posts">
            {posts.map((post) => (
              <Command.Item
                key={post.id}
                onSelect={() => {
                  setOpen(false);
                  navigate(`/blog/${post.slug}`);
                }}
              >
                {post.title}
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command.Dialog>
    </>
  );
}
