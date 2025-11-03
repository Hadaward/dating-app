import { getCurrentUser } from "@/lib/server/auth/session";
import { prisma } from "@/lib/shared/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "match" ou "reaction"

    if (type === "match") {
      // Deletar match
      const match = await prisma.match.findUnique({
        where: { id },
      });

      if (!match) {
        return NextResponse.json(
          { error: "Match not found" },
          { status: 404 }
        );
      }

      // Verificar se o usuário atual é parte do match
      if (match.userAId !== currentUser.id && match.userBId !== currentUser.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      // Determinar o ID do outro usuário
      const otherUserId = match.userAId === currentUser.id ? match.userBId : match.userAId;

      // Deletar match
      await prisma.match.delete({
        where: { id },
      });

      // Deletar também a reação do usuário atual para o outro usuário
      // Isso permite que o usuário apareça novamente nas sugestões
      await prisma.reaction.deleteMany({
        where: {
          fromUserId: currentUser.id,
          toUserId: otherUserId,
        },
      });

      return NextResponse.json({ success: true });
    } else if (type === "reaction") {
      // Deletar reação
      const reaction = await prisma.reaction.findUnique({
        where: { id },
      });

      if (!reaction) {
        return NextResponse.json(
          { error: "Reaction not found" },
          { status: 404 }
        );
      }

      // Verificar se o usuário atual é o autor da reação
      if (reaction.fromUserId !== currentUser.id) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 403 }
        );
      }

      await prisma.reaction.delete({
        where: { id },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid type parameter" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete match/reaction error:", error);
    return NextResponse.json(
      { error: "Error deleting" },
      { status: 500 }
    );
  }
}
