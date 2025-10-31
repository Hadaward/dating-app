import { getExpirationDate, signToken } from '@/lib/auth/jwt';
import { prisma } from "@/lib/shared/prisma";
import { signUpSchema } from '@/lib/shared/schemas/auth';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validar dados de entrada
    const validation = signUpSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: validation.error },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, dateOfBirth, gender, preference, photo } = validation.data;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'E-mail já cadastrado' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário com perfil
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        profile: {
          create: {
            gender,
            preference,
          },
        },
        ...(photo && {
          photos: {
            create: {
              url: photo,
            },
          },
        }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });

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

    return NextResponse.json(
      {
        token,
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Erro ao criar conta' },
      { status: 500 }
    );
  }
}
