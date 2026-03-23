'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUserData, Markdown } from '@/components';
import type { Topic } from '@/types';

interface Question {
  id: string;
  topic: Topic;
  question: string;
  answer: string;
}

function generateQuestions(topicList: Topic[]): Question[] {
  const questions: Question[] = [];
  
  topicList.forEach(topic => {
    // Add questions from the topic's quizQuestions array
    if (topic.quizQuestions && topic.quizQuestions.length > 0) {
      topic.quizQuestions.forEach((q, idx) => {
        questions.push({
          id: `${topic.id}-q-${idx}`,
          topic,
          question: q.question,
          answer: q.answer,
        });
      });
    }
  });
  
  return questions;
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function QuizPage() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizStarted, setQuizStarted] = useState(false);
  const { addQuizResult } = useUserData();

  // Load topics and generate questions
  useEffect(() => {
    fetch('/api/topics')
      .then(res => res.json())
      .then((topics: Topic[]) => {
        const questions = generateQuestions(topics);
        setAllQuestions(shuffleArray(questions));
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error loading quiz:', err);
        setIsLoading(false);
      });
  }, []);

  const currentQuestion = quizQuestions[currentIndex];

  const startQuiz = (count: number) => {
    const selected = shuffleArray(allQuestions).slice(0, count);
    setQuizQuestions(selected);
    setQuizStarted(true);
  };

  const handleAnswer = (knew: boolean) => {
    if (!currentQuestion) return;
    
    // Track the result
    addQuizResult({
      questionId: currentQuestion.id,
      topicId: currentQuestion.topic.id,
      question: currentQuestion.question,
      correct: knew,
    });

    if (knew) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
    }

    if (currentIndex + 1 >= quizQuestions.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const resetQuiz = () => {
    setQuizQuestions([]);
    setCurrentIndex(0);
    setShowAnswer(false);
    setScore({ correct: 0, incorrect: 0 });
    setIsComplete(false);
    setQuizStarted(false);
  };

  // Show loading state while questions are being loaded
  if (isLoading) {
    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center text-[var(--ink-light)]">
            Loading quiz...
          </div>
        </div>
      </div>
    );
  }

  if (allQuestions.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center">
            <div className="text-4xl mb-6 font-serif">No questions yet</div>
            <p className="text-[var(--ink-light)] mb-8">
              There are no quiz questions available.
            </p>
            <Link
              href="/categories"
              className="px-5 py-2.5 bg-[var(--ink)] hover:opacity-80 text-[var(--background)] text-sm tracking-wide transition-colors"
            >
              Browse Subjects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    const presets = [5, 10, 20, allQuestions.length].filter(
      (v, i, a) => v <= allQuestions.length && a.indexOf(v) === i
    );

    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-3">
              Start a Quiz
            </h1>
            <p className="text-[var(--ink-light)]">
              {allQuestions.length} questions available. How many would you like?
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {presets.map((count) => (
              <button
                key={count}
                onClick={() => startQuiz(count)}
                className="py-4 bg-[var(--paper)] hover:bg-[var(--code-bg)] border border-[var(--border)] text-[var(--ink)] font-serif text-lg transition-colors cursor-pointer"
              >
                {count === allQuestions.length ? `All (${count})` : count}
              </button>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-[var(--ink-light)] hover:text-[var(--ink)] transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const percentage = Math.round((score.correct / quizQuestions.length) * 100);
    
    return (
      <div className="py-12">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center">
            <div className="text-4xl mb-6 font-serif">
              {percentage >= 80 ? 'Excellent!' : percentage >= 50 ? 'Good effort!' : 'Keep studying!'}
            </div>
            <h1 className="text-2xl font-serif font-bold text-[var(--ink)] mb-4">Quiz Complete</h1>
            <p className="text-lg text-[var(--ink-light)] mb-8">
              You scored {score.correct} out of {quizQuestions.length} ({percentage}%)
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[var(--paper)] border border-[var(--border)] p-6 paper-shadow">
                <div className="text-2xl font-serif font-bold text-[var(--ink)]">{score.correct}</div>
                <div className="text-[var(--ink-light)] text-sm">Correct</div>
              </div>
              <div className="bg-[var(--paper)] border border-[var(--border)] p-6 paper-shadow">
                <div className="text-2xl font-serif font-bold text-[var(--ink)]">{score.incorrect}</div>
                <div className="text-[var(--ink-light)] text-sm">To Review</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                onClick={resetQuiz}
                className="px-5 py-2.5 bg-[var(--ink)] hover:opacity-80 text-[var(--background)] text-sm tracking-wide transition-colors"
              >
                Try Again
              </button>
              <Link
                href="/categories"
                className="px-5 py-2.5 bg-[var(--paper)] hover:bg-[var(--code-bg)] border border-[var(--border)] text-[var(--ink)] text-sm tracking-wide transition-colors"
              >
                Review Notes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-xl mx-auto px-6">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-[var(--ink-light)] mb-2">
            <span>Question {currentIndex + 1} of {quizQuestions.length}</span>
            <span>{score.correct} correct</span>
          </div>
          <div className="h-1 bg-[var(--border)] overflow-hidden">
            <div
              className="h-full bg-[var(--ink)] transition-all duration-300"
              style={{ width: `${((currentIndex) / quizQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-[var(--paper)] border border-[var(--border)] p-8 mb-6 paper-shadow">
          <div className="text-xs text-[var(--ink-light)] mb-4 font-mono uppercase tracking-wider">
            {currentQuestion.topic.title}
          </div>
          
          <div className="text-xl font-serif font-semibold text-[var(--ink)] mb-6 leading-relaxed prose prose-invert max-w-none overflow-hidden">
            <Markdown>{currentQuestion.question}</Markdown>
          </div>
          
          {showAnswer ? (
            <div className="bg-[var(--code-bg)] border border-[var(--border)] p-4">
              <div className="text-xs text-[var(--ink-light)] mb-2 uppercase tracking-wider">Answer</div>
              <div className="text-[var(--ink)] leading-relaxed prose prose-invert max-w-none overflow-hidden">
                <Markdown>{currentQuestion.answer}</Markdown>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="w-full py-3 bg-[var(--code-bg)] hover:opacity-80 border border-[var(--border)] text-[var(--ink)] text-sm transition-colors cursor-pointer"
            >
              Reveal Answer
            </button>
          )}
        </div>

        {/* Answer Buttons */}
        {showAnswer && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(false)}
              className="flex-1 py-3 bg-[var(--paper)] hover:bg-[var(--code-bg)] border border-[var(--border)] text-[var(--ink-light)] text-sm transition-colors cursor-pointer"
            >
              Didn&apos;t Know
            </button>
            <button
              onClick={() => handleAnswer(true)}
              className="flex-1 py-3 bg-[var(--ink)] hover:opacity-80 text-[var(--background)] text-sm transition-colors cursor-pointer"
            >
              Got It
            </button>
          </div>
        )}

        {/* Skip to topic */}
        <div className="mt-8 text-center">
          <Link
            href={`/topics/${currentQuestion.topic.id}`}
            className="text-sm text-[var(--accent)] hover:underline"
          >
            View full notes →
          </Link>
        </div>
      </div>
    </div>
  );
}
