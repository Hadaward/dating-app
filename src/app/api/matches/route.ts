import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/shared/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Listar todos os matches do usuário
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Buscar todos os matches do usuário
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
      include: {
        userA: {
          include: {
            photos: {
              take: 1,
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
        },
        userB: {
          include: {
            photos: {
              take: 1,
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
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Formatar matches para retornar o outro usuário
    const formattedMatches = matches.map(match => {
      const otherUser = match.userAId === user.id ? match.userB : match.userA;
      return {
        id: match.id,
        createdAt: match.createdAt,
        user: otherUser,
      };
    });

    return NextResponse.json(formattedMatches);
  } catch (error) {
    console.error('Erro ao buscar matches:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar matches' },
      { status: 500 }
    );
  }
}

// DELETE - Remover um match
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const matchId = searchParams.get('matchId');

    if (!matchId) {
      return NextResponse.json(
        { error: 'ID do match é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se o match pertence ao usuário
    const match = await prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [
          { userAId: user.id },
          { userBId: user.id },
        ],
      },
    });

    if (!match) {
      return NextResponse.json(
        { error: 'Match não encontrado' },
        { status: 404 }
      );
    }

    // Deletar o match
    await prisma.match.delete({
      where: {
        id: matchId,
      },
    });

    return NextResponse.json({
      message: 'Match removido com sucesso',
    });
  } catch (error) {
    console.error('Erro ao remover match:', error);
    return NextResponse.json(
      { error: 'Erro ao remover match' },
      { status: 500 }
    );
  }
}
