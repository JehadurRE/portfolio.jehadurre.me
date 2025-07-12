"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  markdown: string;
  githubUrl?: string; // Base GitHub URL for converting relative image paths
}

// Copy button component for code blocks
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 rounded bg-secondary-700 hover:bg-secondary-600 text-white text-sm transition-colors duration-200 flex items-center gap-1"
      title={copied ? 'Copied!' : 'Copy code'}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ markdown, githubUrl }) => {
  // Helper function to convert relative GitHub URLs to absolute ones


//   console.log(markdown);
  const convertImageUrl = (src: string) => {
    if (!src) return src;
    
    // If it's already an absolute URL, return as is
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return src;
    }
    
    // If we have a GitHub URL and the src is relative, convert it
    if (githubUrl && !src.startsWith('/')) {
      // Remove any leading './' from the path
      const cleanPath = src.replace(/^\.\//, '');
      return `${githubUrl}/raw/main/${cleanPath}`;
    }
    
    return src;
  };
  const components: Components = {
    h1: ({ children }) => (
      <h1 className="text-2xl font-bold mb-6 mt-4 text-gradient">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-xl font-bold mb-4 mt-8 text-secondary-800 dark:text-secondary-200">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-semibold mb-3 mt-6 text-secondary-800 dark:text-secondary-200">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mb-4">{children}</p>
    ),
    code: (props: any) => {
      const { inline, className, children } = props;
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <div className="relative">
            <SyntaxHighlighter
              style={vscDarkPlus}
              language={match[1]}
              PreTag="pre"
              customStyle={{
                background: '#1a202c',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflowX: 'auto',
                marginTop: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid #4a5568',
              }}
              codeTagProps={{
                style: { color: '#68d391' }, // Matches original green-400
              }}
            >
              {codeString}
            </SyntaxHighlighter>
            <CopyButton text={codeString} />
          </div>
        );
      }
      return (
        <code className="bg-secondary-100 dark:bg-secondary-800 px-2 py-1 rounded text-sm font-mono text-secondary-800 dark:text-secondary-200">
          {children}
        </code>
      );
    },
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary-600 dark:text-primary-400 hover:underline"
      >
        {children}
      </a>
    ),
    li: (props: any) => {
      const { children } = props;
      // Check if parent is an ordered list by examining the node type
      const isOrdered = props.ordered || false;
      return (
        <li className={`ml-4 mb-1 ${isOrdered ? 'list-decimal' : 'list-disc'}`}>
          {children}
        </li>
      );
    },
    ul: ({ children }) => (
      <ul className="list-disc ml-4">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal ml-4">{children}</ol>
    ),
    hr: () => (
      <hr className="border-secondary-300 dark:border-secondary-700 my-6" />
    ),
    img: ({ src, alt, title }) => (
      <img
        src={convertImageUrl(src || '')}
        alt={alt || ''}
        title={title}
        className="max-w-full h-auto rounded-lg shadow-md my-4 mx-auto block"
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        onError={(e) => {
          // Fallback for broken images
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 my-4 italic text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-800 py-2 rounded-r">
        {children}
      </blockquote>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse border border-secondary-300 dark:border-secondary-700">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-secondary-100 dark:bg-secondary-800">
        {children}
      </thead>
    ),
    tbody: ({ children }) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }) => (
      <tr className="border-b border-secondary-200 dark:border-secondary-700">
        {children}
      </tr>
    ),
    th: ({ children }) => (
      <th className="border border-secondary-300 dark:border-secondary-700 px-4 py-2 text-left font-semibold">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border border-secondary-300 dark:border-secondary-700 px-4 py-2">
        {children}
      </td>
    ),
  };

  return (
    <div 
      className="prose prose-lg max-w-none markdown-content international-text"
      style={{ 
        fontFamily: '"Inter", "Noto Sans", "Noto Sans Bengali", "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, -apple-system, sans-serif',
        unicodeBidi: 'plaintext',
        textRendering: 'optimizeLegibility'
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkEmoji]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={components}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
