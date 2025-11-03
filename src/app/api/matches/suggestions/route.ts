import { Gender, Orientation } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/server/auth/session";
import { prisma } from "@/lib/shared/prisma";
import { NextRequest, NextResponse } from "next/server";

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export async function GET(req: NextRequest) {
  try {
    // Verificar autenticação
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Buscar perfil do usuário atual com interesses
    const userProfile = await prisma.profile.findUnique({
      where: { userId: currentUser.id },
      include: {
        user: {
          include: {
            interests: {
              include: {
                interest: true,
              },
            },
          },
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Buscar reações do usuário atual
    const existingReactions = await prisma.reaction.findMany({
      where: { fromUserId: currentUser.id },
      select: { 
        toUserId: true,
        type: true,
      },
    });

    // Separar likes/superlikes de dislikes
    const likedUserIds = existingReactions
      .filter((r) => r.type === "LIKE" || r.type === "SUPER_LIKE")
      .map((r) => r.toUserId);
    
    const dislikedUserIds = existingReactions
      .filter((r) => r.type === "DISLIKE")
      .map((r) => r.toUserId);

    // Determinar gêneros compatíveis baseado na orientação
    let compatibleGenders: Gender[] = [];
    
    if (userProfile.orientation === "HETEROSEXUAL") {
      // Hétero: interessado no gênero oposto
      compatibleGenders = userProfile.gender === "MALE" ? ["FEMALE"] : ["MALE"];
    } else if (userProfile.orientation === "GAY") {
      // Gay: homens interessados em homens
      compatibleGenders = ["MALE"];
    } else if (userProfile.orientation === "LESBIAN") {
      // Lésbica: mulheres interessadas em mulheres
      compatibleGenders = ["FEMALE"];
    } else if (userProfile.orientation === "BISEXUAL") {
      // Bissexual: interessado em ambos os gêneros
      compatibleGenders = ["MALE", "FEMALE"];
    } else {
      // OTHER: interessado em todos
      compatibleGenders = ["MALE", "FEMALE"];
    }

    // Construir condições de orientação compatível
    const orientationConditions = [];
    
    if (userProfile.gender === "MALE") {
      orientationConditions.push(
        { orientation: "HETEROSEXUAL" as Orientation, gender: "FEMALE" as Gender },
        { orientation: "GAY" as Orientation, gender: "MALE" as Gender },
        { orientation: "BISEXUAL" as Orientation },
        { orientation: "OTHER" as Orientation }
      );
    } else {
      orientationConditions.push(
        { orientation: "HETEROSEXUAL" as Orientation, gender: "MALE" as Gender },
        { orientation: "LESBIAN" as Orientation, gender: "FEMALE" as Gender },
        { orientation: "BISEXUAL" as Orientation },
        { orientation: "OTHER" as Orientation }
      );
    }

    // Buscar usuários compatíveis (excluindo apenas likes/superlikes)
    const compatibleUsers = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUser.id } },
          { id: { notIn: likedUserIds } }, // Excluir apenas usuários já curtidos
          {
            profile: {
              gender: { in: compatibleGenders },
              OR: orientationConditions,
            },
          },
        ],
      },
      include: {
        profile: true,
        photos: {
          orderBy: { order: "asc" },
        },
        interests: {
          include: {
            interest: true,
          },
        },
      },
      take: 100, // Aumentar para compensar filtros
    });

    // Extrair IDs de interesses do usuário atual
    const userInterestIds = userProfile.user.interests.map((ui) => ui.interestId);

    // Calcular score de compatibilidade e formatar resposta
    const suggestions = compatibleUsers
      .map((user) => {
        const userInterests = user.interests.map((ui) => ui.interestId);
        const commonInterests = userInterestIds.filter((id) =>
          userInterests.includes(id)
        );
        
        // Score base por interesses em comum
        let compatibilityScore = commonInterests.length * 10;

        // Penalizar fortemente se foi disliked anteriormente
        const wasDisliked = dislikedUserIds.includes(user.id);
        if (wasDisliked) {
          compatibilityScore -= 1000; // Penalidade grande para ir pro final da lista
        }

        const mainPhoto = user.photos.find((p) => p.isMain);
        const extraPhotos = user.photos.filter((p) => !p.isMain);

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          age: calculateAge(user.dateOfBirth),
          avatar: mainPhoto?.url || null,
          extraPhotos: extraPhotos.map((p) => ({
            id: p.id,
            url: p.url,
            order: p.order,
          })),
          interests: user.interests.map((ui) => ({
            id: ui.interest.id,
            name: ui.interest.name,
            iconName: ui.interest.iconName,
          })),
          commonInterests: commonInterests.length,
          compatibilityScore,
          wasDisliked, // Adicionar flag para debug
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore) // Ordenar por score
      .slice(0, 20); // Retornar top 20

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Get suggestions error:", error);
    return NextResponse.json(
      { error: "Error fetching suggestions" },
      { status: 500 }
    );
  }
}
