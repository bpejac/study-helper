import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'theoretical-cs',
    name: 'Theoretical Computer Science',
    description: 'Foundations of computation and algorithms',
    icon: '🧮',
  },
  {
    id: 'technical-cs',
    name: 'Technical Computer Science',
    description: 'Hardware, architecture, and low-level systems',
    icon: '🔧',
  },
  {
    id: 'databases',
    name: 'Databases',
    description: 'Data storage, retrieval, and management',
    icon: '🗄️',
  },
  {
    id: 'networks',
    name: 'Computer Networks',
    description: 'Network protocols and communication',
    icon: '🌐',
  },
  // Work Experience
  {
    id: 'languages',
    name: 'Programming Languages',
    description: 'JavaScript and TypeScript expertise from professional experience',
    icon: '📝',
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    description: 'React and modern frontend development',
    icon: '⚛️',
  },
  {
    id: 'backend',
    name: 'Backend Development',
    description: 'Node.js server-side development',
    icon: '🖥️',
  },
  {
    id: 'desktop',
    name: 'Desktop Applications',
    description: 'Cross-platform desktop apps with Electron.js',
    icon: '💻',
  },
];

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id);
}
