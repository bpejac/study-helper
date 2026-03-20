import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface CodeExampleInput {
  title: string;
  language: string;
  code: string;
  explanation?: string;
}

// PUT /api/topics/[id]/code-examples - Update code examples (admin only)
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
    const { codeExamples } = body;

    if (!Array.isArray(codeExamples)) {
      return NextResponse.json(
        { error: 'codeExamples must be an array' },
        { status: 400 }
      );
    }

    // Delete existing code examples and create new ones
    await prisma.codeExample.deleteMany({ where: { topicId: id } });

    const createdCodeExamples = await Promise.all(
      codeExamples.map((ce: CodeExampleInput, index: number) =>
        prisma.codeExample.create({
          data: {
            topicId: id,
            title: ce.title,
            language: ce.language,
            code: ce.code,
            explanation: ce.explanation,
            order: index,
          },
        })
      )
    );

    return NextResponse.json(createdCodeExamples);
  } catch (error) {
    console.error('Error updating code examples:', error);
    return NextResponse.json(
      { error: 'Failed to update code examples' },
      { status: 500 }
    );
  }
}
