import { getExpirationDate, signToken } from '@/lib/server/auth/jwt';
import { prisma } from "@/lib/shared/prisma";
import { signInSchema } from '@/lib/shared/schemas/auth';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar dados de entrada
    const validation = signInSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid data', details: validation.error },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Criar sessão
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: '', // Será preenchido depois
        expiresAt: getExpirationDate(),
      },
    });

    // Gerar token JWT
    const token = signToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Atualizar sessão com o token
    await prisma.session.update({
      where: { id: session.id },
      data: { token },
    });

    // Remover senha da resposta
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Error signing in' },
      { status: 500 }
    );
  }
}