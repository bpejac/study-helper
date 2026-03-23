'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface QuizResult {
  questionId: string;
  topicId: string;
  question: string;
  correct: boolean;
  timestamp: number;
}

interface UserData {
  favorites: string[]; // topic IDs
  quizHistory: QuizResult[];
}

interface UserDataContextType {
  favorites: string[];
  quizHistory: QuizResult[];
  toggleFavorite: (topicId: string) => void;
  isFavorite: (topicId: string) => boolean;
  addQuizResult: (result: Omit<QuizResult, 'timestamp'>) => void;
  getMissedQuestions: () => QuizResult[];
  getTopicStats: (topicId: string) => { correct: number; incorrect: number };
  clearQuizHistory: () => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const STORAGE_KEY = 'studyHelper_userData';

const defaultUserData: UserData = {
  favorites: [],
  quizHistory: [],
};

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserData({
          favorites: parsed.favorites || [],
          quizHistory: parsed.quizHistory || [],
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } catch (error) {
        console.error('Failed to save user data:', error);
      }
    }
  }, [userData, mounted]);

  const toggleFavorite = useCallback((topicId: string) => {
    setUserData(prev => ({
      ...prev,
      favorites: prev.favorites.includes(topicId)
        ? prev.favorites.filter(id => id !== topicId)
        : [...prev.favorites, topicId],
    }));
  }, []);

  const isFavorite = useCallback((topicId: string) => {
    return userData.favorites.includes(topicId);
  }, [userData.favorites]);

  const addQuizResult = useCallback((result: Omit<QuizResult, 'timestamp'>) => {
    setUserData(prev => ({
      ...prev,
      quizHistory: [
        ...prev.quizHistory,
        { ...result, timestamp: Date.now() },
      ],
    }));
  }, []);

  const getMissedQuestions = useCallback(() => {
    // Get unique missed questions (most recent attempt)
    const missedMap = new Map<string, QuizResult>();
    
    // Sort by timestamp descending to get most recent first
    const sorted = [...userData.quizHistory].sort((a, b) => b.timestamp - a.timestamp);
    
    for (const result of sorted) {
      if (!result.correct && !missedMap.has(result.questionId)) {
        missedMap.set(result.questionId, result);
      }
    }
    
    return Array.from(missedMap.values());
  }, [userData.quizHistory]);

  const getTopicStats = useCallback((topicId: string) => {
    const topicResults = userData.quizHistory.filter(r => r.topicId === topicId);
    return {
      correct: topicResults.filter(r => r.correct).length,
      incorrect: topicResults.filter(r => !r.correct).length,
    };
  }, [userData.quizHistory]);

  const clearQuizHistory = useCallback(() => {
    setUserData(prev => ({
      ...prev,
      quizHistory: [],
    }));
  }, []);

  return (
    <UserDataContext.Provider
      value={{
        favorites: userData.favorites,
        quizHistory: userData.quizHistory,
        toggleFavorite,
        isFavorite,
        addQuizResult,
        getMissedQuestions,
        getTopicStats,
        clearQuizHistory,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) {
    // Return default values for SSR
    return {
      favorites: [],
      quizHistory: [],
      toggleFavorite: () => {},
      isFavorite: () => false,
      addQuizResult: () => {},
      getMissedQuestions: () => [],
      getTopicStats: () => ({ correct: 0, incorrect: 0 }),
      clearQuizHistory: () => {},
    };
  }
  return context;
}
