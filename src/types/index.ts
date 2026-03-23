export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
}

export interface KeyPoint {
  title: string;
  description: string;
}

export interface QuizQuestion {
  question: string;
  answer: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category: string;
  keyPoints: KeyPoint[];
  codeExamples: CodeExample[];
  quizQuestions?: QuizQuestion[];
  lastReviewed?: string;
  confidence: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}
