import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/shared/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Buscar perfil de um usuário específico
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { userId } = await params;

    // Buscar usuário com todas as informações
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        photos: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        profile: true,
        interests: {
          include: {
            interest: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Calcular idade
    const age = Math.floor(
      (new Date().getTime() - new Date(user.dateOfBirth).getTime()) / 
      (365.25 * 24 * 60 * 60 * 1000)
    );

    // Verificar se há match entre os usuários
    const match = await prisma.match.findFirst({
      where: {
        OR: [
          { userAId: currentUser.id, userBId: userId },
          { userAId: userId, userBId: currentUser.id },
        ],
      },
    });

    // Verificar se o usuário atual reagiu a este perfil
    const reaction = await prisma.reaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: currentUser.id,
          toUserId: userId,
        },
      },
    });

    // Buscar estatísticas do usuário (apenas se houver match)
    let stats = null;
    if (match) {
      const totalMatches = await prisma.match.count({
        where: {
          OR: [
            { userAId: userId },
            { userBId: userId },
          ],
        },
      });

      stats = {
        totalMatches,
      };
    }

    return NextResponse.json({
      ...user,
      age,
      hasMatch: !!match,
      reaction: reaction?.type || null,
      stats,
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    );
  }
}
