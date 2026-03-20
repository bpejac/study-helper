import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface KeyPointInput {
  title: string;
  description: string;
}

// PUT /api/topics/[id]/key-points - Update key points (admin only)
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
    const { keyPoints } = body;

    if (!Array.isArray(keyPoints)) {
      return NextResponse.json(
        { error: 'keyPoints must be an array' },
        { status: 400 }
      );
    }

    // Delete existing key points and create new ones
    await prisma.keyPoint.deleteMany({ where: { topicId: id } });

    const createdKeyPoints = await Promise.all(
      keyPoints.map((kp: KeyPointInput, index: number) =>
        prisma.keyPoint.create({
          data: {
            topicId: id,
            title: kp.title,
            description: kp.description,
            order: index,
          },
        })
      )
    );

    return NextResponse.json(createdKeyPoints);
  } catch (error) {
    console.error('Error updating key points:', error);
    return NextResponse.json(
      { error: 'Failed to update key points' },
      { status: 500 }
    );
  }
}
