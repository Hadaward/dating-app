import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/shared/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Buscar estatísticas do usuário atual
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Contar likes enviados
    const totalLikes = await prisma.reaction.count({
      where: {
        fromUserId: user.id,
        type: 'LIKE',
      },
    });

    // Contar super likes enviados
    const totalSuperLikes = await prisma.reaction.count({
      where: {
        fromUserId: user.id,
        type: 'SUPER_LIKE',
      },
    });

    // Contar matches
    const totalMatches = await prisma.match.count({
      where: {
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
    });

    // Contar likes recebidos
    const totalLikesReceived = await prisma.reaction.count({
      where: {
        toUserId: user.id,
        type: {
          in: ['LIKE', 'SUPER_LIKE'],
        },
      },
    });

    return NextResponse.json({
      totalLikes,
      totalSuperLikes,
      totalMatches,
      totalLikesReceived,
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar estatísticas' },
      { status: 500 }
    );
  }
}
