import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ActivityCalendar, ThemeInput } from 'react-activity-calendar';
import { Octokit } from '@octokit/rest';
import { Star, GitFork, Book, GitCommit } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface RepoData {
  name: string;
  description: string;
  stars: number;
  forks: number;
  url: string;
}

// ⚡ Bolt Performance Optimization:
// Hoist static `explicitTheme` object outside the component body to prevent it
// from being recreated on every render, which avoids unnecessary re-renders of ActivityCalendar.
const explicitTheme: ThemeInput = {
  light: ['#f0fdf4', '#dcfce7', '#86efac', '#22c55e', '#166534'],
  dark: ['#1e293b', '#064e3b', '#059669', '#10b981', '#34d399'],
};

const GithubActivity: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const [repos, setRepos] = useState<RepoData[]>([]);
  const [stats, setStats] = useState({ stars: 0, forks: 0, totalCommits: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const username = "JehadurRE";

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        const octokit = new Octokit();

        // 1. Fetch public repos to calculate stats and get pinned/recent repos
        const reposResponse = await octokit.rest.repos.listForUser({
          username,
          sort: 'updated',
          per_page: 100,
        });

        const publicRepos = reposResponse.data;

        let totalStars = 0;
        let totalForks = 0;

        const processedRepos: RepoData[] = publicRepos
          .filter(repo => !repo.fork)
          .map(repo => {
            totalStars += repo.stargazers_count || 0;
            totalForks += repo.forks_count || 0;
            return {
              name: repo.name,
              description: repo.description || '',
              stars: repo.stargazers_count || 0,
              forks: repo.forks_count || 0,
              url: repo.html_url,
            };
          });

        // Get top 4 most starred repos
        const topRepos = processedRepos.sort((a, b) => b.stars - a.stars).slice(0, 4);

        setRepos(topRepos);

        // 2. We can't fetch the full contribution graph easily from the REST API without making hundreds of calls.
        // We will fetch recent events to estimate activity, and fallback to a proxy for the visual graph if needed,
        // or just use recent commits.
        // As a compromise without GraphQL token, we will simulate a graph from public events or use a proxy.
        // For this demo, let's fetch recent commits.

        const eventsResponse = await octokit.rest.activity.listPublicEventsForUser({
            username,
            per_page: 100
        });

        const commits = eventsResponse.data.filter(e => e.type === 'PushEvent');
        let recentCommits = 0;
        commits.forEach(e => {
            if (e.payload && 'commits' in e.payload && Array.isArray(e.payload.commits)) {
                recentCommits += e.payload.commits.length;
            }
        });

        setStats({ stars: totalStars, forks: totalForks, totalCommits: recentCommits });

        // 3. For the calendar, we will use a known community API since GitHub REST API doesn't expose the graph nicely
        // without an authenticated GraphQL request.
        const response = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        if (response.ok) {
            const data = await response.json();
            if (data && data.contributions) {
                const today = new Date();
                const lastYear = new Date(today);
                lastYear.setFullYear(today.getFullYear() - 1);

                const todayStr = today.toISOString().split('T')[0];
                const lastYearStr = lastYear.toISOString().split('T')[0];

                const formattedData: ContributionDay[] = data.contributions.flat()
                  .map((d: { date: string; contributionCount: number; contributionLevel: string }) => {
                     let level: 0|1|2|3|4 = 0;
                     if (d.contributionLevel === 'NONE') level = 0;
                     else if (d.contributionLevel === 'FIRST_QUARTILE') level = 1;
                     else if (d.contributionLevel === 'SECOND_QUARTILE') level = 2;
                     else if (d.contributionLevel === 'THIRD_QUARTILE') level = 3;
                     else if (d.contributionLevel === 'FOURTH_QUARTILE') level = 4;

                     // Fallback map if string value isn't matched
                     if (level === 0 && d.contributionCount > 0) {
                         if (d.contributionCount <= 3) level = 1;
                         else if (d.contributionCount <= 6) level = 2;
                         else if (d.contributionCount <= 9) level = 3;
                         else level = 4;
                     }

                     return { date: d.date, count: d.contributionCount, level };
                  })
                  .filter((d: ContributionDay) => d.date >= lastYearStr && d.date <= todayStr)
                  .sort((a: ContributionDay, b: ContributionDay) => a.date > b.date ? 1 : a.date < b.date ? -1 : 0);

                setContributions(formattedData);
            }
        }
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Could not load full GitHub data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16 w-full"
    >
      <div className="glass-card p-6 md:p-8 rounded-2xl w-full">
        <h3 className="text-2xl font-bold mb-6 text-secondary-800 dark:text-secondary-200 text-center">
          GitHub Activity
        </h3>

        {loading ? (
           <div className="animate-pulse space-y-4">
               <div className="h-20 w-full bg-secondary-200 dark:bg-secondary-700 rounded mb-6"></div>
               <div className="h-40 w-full bg-secondary-200 dark:bg-secondary-700 rounded"></div>
           </div>
        ) : error && !contributions.length ? (
          <p className="text-secondary-500 dark:text-secondary-400 text-center py-4">{error}</p>
        ) : (
          <div className="space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center p-4 bg-primary-50 dark:bg-secondary-800 rounded-xl">
                <Star className="w-6 h-6 text-yellow-500 mb-2" />
                <span className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">{stats.stars}</span>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Total Stars</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary-50 dark:bg-secondary-800 rounded-xl">
                <GitFork className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">{stats.forks}</span>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Total Forks</span>
              </div>
              <div className="flex flex-col items-center p-4 bg-primary-50 dark:bg-secondary-800 rounded-xl">
                <GitCommit className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold text-secondary-800 dark:text-secondary-200">{stats.totalCommits}+</span>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Recent Commits</span>
              </div>
            </div>

            {/* Top Repos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map(repo => (
                    <a key={repo.name} href={repo.url} target="_blank" rel="noopener noreferrer" className="block p-4 border border-secondary-200 dark:border-secondary-700 rounded-xl hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-2 mb-2">
                            <Book className="w-4 h-4 text-primary-500" />
                            <h4 className="font-semibold text-primary-600 dark:text-primary-400">{repo.name}</h4>
                        </div>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3 line-clamp-2">{repo.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-secondary-500 dark:text-secondary-400">
                            <span className="flex items-center space-x-1"><Star className="w-3 h-3" /> <span>{repo.stars}</span></span>
                            <span className="flex items-center space-x-1"><GitFork className="w-3 h-3" /> <span>{repo.forks}</span></span>
                        </div>
                    </a>
                ))}
            </div>

            {/* Calendar */}
            {contributions.length > 0 && (
                <div className="w-full overflow-x-auto flex justify-center">
                    <div className="min-w-max">
                        <ActivityCalendar
                            data={contributions}
                            theme={explicitTheme}
                            labels={{
                                totalCount: `{{count}} contributions in the last year`,
                            }}
                        />
                    </div>
                </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GithubActivity;
