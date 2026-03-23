import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface QuizQuestionInput {
  question: string;
  answer: string;
}

// PUT /api/topics/[id]/quiz-questions - Update quiz questions (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { quizQuestions } = body;

    if (!Array.isArray(quizQuestions)) {
      return NextResponse.json(
        { error: 'quizQuestions must be an array' },
        { status: 400 }
      );
    }

    // Delete existing quiz questions and create new ones
    await prisma.quizQuestion.deleteMany({ where: { topicId: id } });

    const createdQuizQuestions = await Promise.all(
      quizQuestions.map((qq: QuizQuestionInput, index: number) =>
        prisma.quizQuestion.create({
          data: {
            topicId: id,
            question: qq.question,
            answer: qq.answer,
            order: index,
          },
        })
      )
    );

    return NextResponse.json(createdQuizQuestions);
  } catch (error) {
    console.error('Error updating quiz questions:', error);
    return NextResponse.json(
      { error: 'Failed to update quiz questions' },
      { status: 500 }
    );
  }
}
