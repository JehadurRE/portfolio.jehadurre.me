import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id: string;
  verification_url: string;
  image_url: string;
  description: string;
  skills: string[];
  category: 'technical' | 'professional' | 'academic';
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'award' | 'recognition' | 'milestone';
  icon: string;
  details: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  published_at: string;
  read_time: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'research' | 'tools' | 'database' | 'cloud' | 'mobile';
  technologies: string[];
  icon: string;
  proficiency_level: number;
  years_experience: number;
  description: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// API functions
export const certificationsApi = {
  getAll: async (): Promise<Certification[]> => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByCategory: async (category: string): Promise<Certification[]> => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('category', category)
      .order('issue_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

export const achievementsApi = {
  getAll: async (): Promise<Achievement[]> => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByCategory: async (category: string): Promise<Achievement[]> => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};

export const blogApi = {
  getPublished: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByTag: async (tag: string): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .contains('tags', [tag])
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getBySlug: async (slug: string): Promise<BlogPost | null> => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();
    
    if (error) throw error;
    return data;
  }
};

export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('proficiency_level', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getFeatured: async (): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('is_featured', true)
      .order('proficiency_level', { ascending: false });
    
    if (error) throw error;
    return data || [];
  },

  getByCategory: async (category: string): Promise<Skill[]> => {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('category', category)
      .order('proficiency_level', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }
};