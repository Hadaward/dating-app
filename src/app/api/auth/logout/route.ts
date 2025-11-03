import { verifyToken } from "@/lib/server/auth/jwt";
import { prisma } from "@/lib/shared/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Token not provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verificar e decodificar token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    // Deletar sessão do banco de dados
    await prisma.session.delete({
      where: { id: payload.sessionId },
    }).catch(() => {
      // Sessão pode já ter sido deletada, ignorar erro
    });

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Error logging out" },
      { status: 500 }
    );
  }
}
