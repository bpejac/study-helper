import { prisma } from './prisma';
import type { Category, Topic } from '@/types';
import type { 
  Topic as PrismaTopic, 
  KeyPoint as PrismaKeyPoint,
  CodeExample as PrismaCodeExample,
  QuizQuestion as PrismaQuizQuestion,
  Category as PrismaCategory
} from '@prisma/client';

type TopicWithRelations = PrismaTopic & {
  keyPoints: PrismaKeyPoint[];
  codeExamples: PrismaCodeExample[];
  quizQuestions: PrismaQuizQuestion[];
};

// Transform database results to match the existing Topic interface
function transformTopicFromDB(dbTopic: TopicWithRelations): Topic {
  return {
    id: dbTopic.id,
    title: dbTopic.title,
    description: dbTopic.description,
    icon: dbTopic.icon || undefined,
    category: dbTopic.categoryId,
    confidence: dbTopic.confidence as 'beginner' | 'intermediate' | 'advanced' | 'expert',
    lastReviewed: dbTopic.lastReviewed || undefined,
    keyPoints: dbTopic.keyPoints.map((kp) => ({
      title: kp.title,
      description: kp.description,
    })),
    codeExamples: dbTopic.codeExamples.map((ce) => ({
      title: ce.title,
      language: ce.language,
      code: ce.code,
      explanation: ce.explanation || undefined,
    })),
    quizQuestions: dbTopic.quizQuestions.map((qq) => ({
      question: qq.question,
      answer: qq.answer,
    })),
  };
}

// Transform database category to match the existing Category interface
function transformCategoryFromDB(dbCategory: PrismaCategory): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    description: dbCategory.description,
    icon: dbCategory.icon,
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
  return categories.map(transformCategoryFromDB);
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category ? transformCategoryFromDB(category) : null;
}

export async function getAllTopics(): Promise<Topic[]> {
  const topics = await prisma.topic.findMany({
    include: {
      keyPoints: { orderBy: { order: 'asc' } },
      codeExamples: { orderBy: { order: 'asc' } },
      quizQuestions: { orderBy: { order: 'asc' } },
    },
    orderBy: { title: 'asc' },
  });
  return topics.map(transformTopicFromDB);
}

export async function getTopicById(id: string): Promise<Topic | null> {
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      keyPoints: { orderBy: { order: 'asc' } },
      codeExamples: { orderBy: { order: 'asc' } },
      quizQuestions: { orderBy: { order: 'asc' } },
    },
  });
  return topic ? transformTopicFromDB(topic) : null;
}

export async function getTopicsByCategory(categoryId: string): Promise<Topic[]> {
  const topics = await prisma.topic.findMany({
    where: { categoryId },
    include: {
      keyPoints: { orderBy: { order: 'asc' } },
      codeExamples: { orderBy: { order: 'asc' } },
      quizQuestions: { orderBy: { order: 'asc' } },
    },
    orderBy: { title: 'asc' },
  });
  return topics.map(transformTopicFromDB);
}

export async function searchTopics(query: string): Promise<Topic[]> {
  const lowerQuery = query.toLowerCase();
  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { title: { contains: lowerQuery } },
        { description: { contains: lowerQuery } },
      ],
    },
    include: {
      keyPoints: { orderBy: { order: 'asc' } },
      codeExamples: { orderBy: { order: 'asc' } },
      quizQuestions: { orderBy: { order: 'asc' } },
    },
    orderBy: { title: 'asc' },
  });
  return topics.map(transformTopicFromDB);
}
