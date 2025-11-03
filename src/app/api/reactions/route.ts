import { ReactionType } from "@/generated/prisma/enums";
import { getCurrentUser } from "@/lib/server/auth/session";
import { prisma } from "@/lib/shared/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const reactionSchema = z.object({
  toUserId: z.string(),
  type: z.enum(["LIKE", "SUPER_LIKE", "DISLIKE"]),
});

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const validation = reactionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error },
        { status: 400 }
      );
    }

    const { toUserId, type } = validation.data;

    // Verificar se já existe reação
    const existingReaction = await prisma.reaction.findUnique({
      where: {
        fromUserId_toUserId: {
          fromUserId: currentUser.id,
          toUserId,
        },
      },
    });

    if (existingReaction) {
      // Atualizar reação existente
      await prisma.reaction.update({
        where: { id: existingReaction.id },
        data: { type: type as ReactionType },
      });
    } else {
      // Criar nova reação
      await prisma.reaction.create({
        data: {
          fromUserId: currentUser.id,
          toUserId,
          type: type as ReactionType,
        },
      });
    }

    // Verificar se é um match (ambos deram like)
    if (type === "LIKE" || type === "SUPER_LIKE") {
      const reciprocalReaction = await prisma.reaction.findFirst({
        where: {
          fromUserId: toUserId,
          toUserId: currentUser.id,
          type: { in: ["LIKE", "SUPER_LIKE"] },
        },
      });

      if (reciprocalReaction) {
        // Criar match se não existir
        const existingMatch = await prisma.match.findFirst({
          where: {
            OR: [
              { userAId: currentUser.id, userBId: toUserId },
              { userAId: toUserId, userBId: currentUser.id },
            ],
          },
        });

        if (!existingMatch) {
          await prisma.match.create({
            data: {
              userAId: currentUser.id,
              userBId: toUserId,
            },
          });

          return NextResponse.json({ matched: true });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reaction error:", error);
    return NextResponse.json(
      { error: "Error processing reaction" },
      { status: 500 }
    );
  }
}
