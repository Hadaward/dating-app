import { getCurrentUser } from "@/lib/server/auth/session";
import { prisma } from "@/lib/shared/prisma";
import { NextResponse } from "next/server";

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Buscar matches mútuos
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { userAId: currentUser.id },
          { userBId: currentUser.id },
        ],
      },
      include: {
        userA: {
          include: {
            photos: {
              where: { isMain: true },
            },
            profile: true,
          },
        },
        userB: {
          include: {
            photos: {
              where: { isMain: true },
            },
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Formatar matches
    const formattedMatches = matches.map((match) => {
      const otherUser = match.userAId === currentUser.id ? match.userB : match.userA;
      return {
        id: match.id,
        userId: otherUser.id,
        firstName: otherUser.firstName,
        lastName: otherUser.lastName,
        age: calculateAge(otherUser.dateOfBirth),
        avatar: otherUser.photos[0]?.url || null,
        matchedAt: match.createdAt,
        type: "match" as const,
      };
    });

    // Buscar usuários que o usuário atual curtiu
    const youLiked = await prisma.reaction.findMany({
      where: {
        fromUserId: currentUser.id,
        type: { in: ["LIKE", "SUPER_LIKE"] },
      },
      include: {
        toUser: {
          include: {
            photos: {
              where: { isMain: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedYouLiked = youLiked.map((reaction) => ({
      id: reaction.id,
      userId: reaction.toUser.id,
      firstName: reaction.toUser.firstName,
      lastName: reaction.toUser.lastName,
      age: calculateAge(reaction.toUser.dateOfBirth),
      avatar: reaction.toUser.photos[0]?.url || null,
      likedAt: reaction.createdAt,
      type: "you_liked" as const,
      reactionType: reaction.type,
    }));

    // Buscar usuários que curtiram o usuário atual
    const likedYou = await prisma.reaction.findMany({
      where: {
        toUserId: currentUser.id,
        type: { in: ["LIKE", "SUPER_LIKE"] },
      },
      include: {
        fromUser: {
          include: {
            photos: {
              where: { isMain: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedLikedYou = likedYou.map((reaction) => ({
      id: reaction.id,
      userId: reaction.fromUser.id,
      firstName: reaction.fromUser.firstName,
      lastName: reaction.fromUser.lastName,
      age: calculateAge(reaction.fromUser.dateOfBirth),
      avatar: reaction.fromUser.photos[0]?.url || null,
      likedAt: reaction.createdAt,
      type: "liked_you" as const,
      reactionType: reaction.type,
    }));

    // Buscar visualizações (views) - usuários que viram o perfil
    const views = await prisma.reaction.findMany({
      where: {
        toUserId: currentUser.id,
      },
      include: {
        fromUser: {
          include: {
            photos: {
              where: { isMain: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    const formattedViews = views.map((reaction) => ({
      id: reaction.id,
      userId: reaction.fromUser.id,
      firstName: reaction.fromUser.firstName,
      lastName: reaction.fromUser.lastName,
      age: calculateAge(reaction.fromUser.dateOfBirth),
      avatar: reaction.fromUser.photos[0]?.url || null,
      viewedAt: reaction.createdAt,
      type: "view" as const,
    }));

    return NextResponse.json({
      matches: formattedMatches,
      youLiked: formattedYouLiked,
      likedYou: formattedLikedYou,
      views: formattedViews,
    });
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json(
      { error: "Error fetching matches" },
      { status: 500 }
    );
  }
}
