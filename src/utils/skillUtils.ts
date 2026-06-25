import React from 'react';
import { Code, Zap, BookOpen, Lightbulb, Database, Cloud, Smartphone, Award, Users } from 'lucide-react';

const icons: Record<string, React.ElementType> = {
  Code,
  Zap,
  BookOpen,
  Lightbulb,
  Database,
  Cloud,
  Smartphone,
  Award,
  Users
};

export const getIconComponent = (iconName: string) => {
  return icons[iconName] || Code;
};

export const getProficiencyText = (level: number) => {
  switch (level) {
    case 5: return 'Expert';
    case 4: return 'Advanced';
    case 3: return 'Intermediate';
    case 2: return 'Beginner';
    case 1: return 'Novice';
    default: return 'Unknown';
  }
};
