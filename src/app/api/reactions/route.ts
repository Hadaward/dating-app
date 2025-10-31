import { getCurrentUser } from '@/lib/auth/session';
import { prisma } from '@/lib/shared/prisma';
import { reactionSchema } from '@/lib/shared/schemas/profile';
import { NextRequest, NextResponse } from 'next/server';

// POST - Criar uma reação (like, super like, dislike)
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = reactionSchema.parse(body);

    // Verificar se o usuário não está reagindo a si mesmo
    if (validatedData.toUserId === user.id) {
      return NextResponse.json(
        { error: 'Você não pode reagir ao seu próprio perfil' },
        { status: 400 }
      );
    }

    // Verificar se já existe uma reação
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: user.id,
          toUserId: validatedData.toUserId,
        },
      },
    });

    if (existingReaction) {
      // Atualizar reação existente
      const updatedReaction = await prisma.reaction.update({
        where: {
          id: existingReaction.id,
        },
        data: {
          type: validatedData.type,
        },
      });

      // Verificar se houve match (apenas para LIKE e SUPER_LIKE)
      if (validatedData.type === 'LIKE' || validatedData.type === 'SUPER_LIKE') {
        const reciprocalReaction = await prisma.reaction.findFirst({
          where: {
            fromUserId: validatedData.toUserId,
            toUserId: user.id,
            type: {
              in: ['LIKE', 'SUPER_LIKE'],
            },
          },
        });

        if (reciprocalReaction) {
          // Criar match se não existir
          const existingMatch = await prisma.match.findFirst({
            where: {
              OR: [
                { userAId: user.id, userBId: validatedData.toUserId },
                { userAId: validatedData.toUserId, userBId: user.id },
              ],
            },
          });

          if (!existingMatch) {
            const match = await prisma.match.create({
              data: {
                userAId: user.id,
                userBId: validatedData.toUserId,
              },
            });

            return NextResponse.json({
              reaction: updatedReaction,
              matched: true,
              match,
            });
          }
        }
      } else {
        // Se for DISLIKE, remover match se existir
        await prisma.match.deleteMany({
          where: {
            OR: [
              { userAId: user.id, userBId: validatedData.toUserId },
              { userAId: validatedData.toUserId, userBId: user.id },
            ],
          },
        });
      }

      return NextResponse.json({
        reaction: updatedReaction,
        matched: false,
      });
    }

    // Criar nova reação
    const reaction = await prisma.reaction.create({
      data: {
        fromUserId: user.id,
        toUserId: validatedData.toUserId,
        type: validatedData.type,
      },
    });

    // Verificar se houve match (apenas para LIKE e SUPER_LIKE)
    if (validatedData.type === 'LIKE' || validatedData.type === 'SUPER_LIKE') {
      const reciprocalReaction = await prisma.reaction.findFirst({
        where: {
          fromUserId: validatedData.toUserId,
          toUserId: user.id,
          type: {
            in: ['LIKE', 'SUPER_LIKE'],
          },
        },
      });

      if (reciprocalReaction) {
        const match = await prisma.match.create({
          data: {
            userAId: user.id,
            userBId: validatedData.toUserId,
          },
        });

        return NextResponse.json({
          reaction,
          matched: true,
          match,
        });
      }
    }

    return NextResponse.json({
      reaction,
      matched: false,
    });
  } catch (error) {
    console.error('Erro ao criar reação:', error);
    
    if (error instanceof Error && 'issues' in error) {
      return NextResponse.json(
        { error: 'Dados inválidos', issues: error },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erro ao processar reação' },
      { status: 500 }
    );
  }
}

// GET - Listar reações do usuário
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
    const type = searchParams.get('type') as 'sent' | 'received' | null;

    let reactions;

    if (type === 'sent') {
      // Reações enviadas pelo usuário
      reactions = await prisma.reaction.findMany({
        where: {
          fromUserId: user.id,
        },
        include: {
          toUser: {
            include: {
              photos: {
                take: 1,
                orderBy: {
                  createdAt: 'desc',
                },
              },
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else if (type === 'received') {
      // Reações recebidas pelo usuário
      reactions = await prisma.reaction.findMany({
        where: {
          toUserId: user.id,
          type: {
            in: ['LIKE', 'SUPER_LIKE'],
          },
        },
        include: {
          fromUser: {
            include: {
              photos: {
                take: 1,
                orderBy: {
                  createdAt: 'desc',
                },
              },
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Tipo de reação inválido. Use "sent" ou "received"' },
        { status: 400 }
      );
    }

    return NextResponse.json(reactions);
  } catch (error) {
    console.error('Erro ao buscar reações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar reações' },
      { status: 500 }
    );
  }
}
