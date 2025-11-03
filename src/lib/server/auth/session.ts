import { prisma } from "@/lib/shared/prisma";
import { cookies } from 'next/headers';
import { verifyToken } from './jwt';

export async function getSession(token: string) {
  // Verificar token JWT
  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  // Buscar sessão no banco
  const session = await prisma.session.findUnique({
    where: { 
      id: payload.sessionId,
      token,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Verificar se sessão expirou
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({
      where: { id: session.id },
    });
    return null;
  }

  return session;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const session = await getSession(token);
  return session?.user || null;
}

export async function deleteSession(sessionId: string) {
  await prisma.session.delete({
    where: { id: sessionId },
  });
}