import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/shared/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET - Descobrir novos usuários para match
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Buscar o perfil do usuário atual
    const currentUserProfile = await prisma.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!currentUserProfile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado. Complete seu perfil primeiro.' },
        { status: 400 }
      );
    }

    // Buscar IDs de usuários com quem já interagiu (reações ou matches)
    const reactedUserIds = await prisma.reaction.findMany({
      where: {
        fromUserId: user.id,
      },
      select: {
        toUserId: true,
      },
    });

    const reactedIds = reactedUserIds.map(r => r.toUserId);

    // Buscar perfis que correspondem às preferências
    const profiles = await prisma.profile.findMany({
      where: {
        userId: {
          not: user.id,
          notIn: reactedIds,
        },
        gender: currentUserProfile.preference,
        preference: {
          in: [currentUserProfile.gender, 'OTHER'],
        },
      },
      include: {
        user: {
          include: {
            photos: {
              orderBy: {
                createdAt: 'desc',
              },
            },
            interests: {
              include: {
                interest: true,
              },
            },
          },
        },
      },
      take: limit,
      orderBy: {
        user: {
          createdAt: 'desc',
        },
      },
    });

    // Extrair usuários dos perfis
    const users = profiles.map(profile => ({
      ...profile.user,
      profile: {
        id: profile.id,
        gender: profile.gender,
        preference: profile.preference,
      },
    }));

    // Calcular idade de cada usuário
    const usersWithAge = users.map(u => {
      const age = Math.floor(
        (new Date().getTime() - new Date(u.dateOfBirth).getTime()) / 
        (365.25 * 24 * 60 * 60 * 1000)
      );
      
      return {
        ...u,
        age,
      };
    });

    return NextResponse.json(usersWithAge);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar usuários' },
      { status: 500 }
    );
  }
}
