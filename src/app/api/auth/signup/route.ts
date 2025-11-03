import { getExpirationDate, signToken } from '@/lib/server/auth/jwt';
import { savePhoto } from '@/lib/server/upload';
import { prisma } from "@/lib/shared/prisma";
import { signUpSchema } from '@/lib/shared/schemas/auth';
import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extrair dados do FormData
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      dateOfBirth: formData.get("dateOfBirth") as string,
      gender: formData.get("gender") as string,
      orientation: formData.get("orientation") as string,
      preference: formData.get("preference") as string,
      photo: formData.get("photo") as File,
      interests: formData.get("interests") ? JSON.parse(formData.get("interests") as string) : [],
    };

    // Validar dados de entrada
    const validation = signUpSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error },
        { status: 400 }
      );
    }

    const { email, password, firstName, lastName, dateOfBirth, gender, orientation, photo, interests } = validation.data;

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário sem foto primeiro
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
            orientation
          },
        },
        ...(interests && interests.length > 0 && {
          interests: {
            create: interests.map((interestId: string) => ({
              interestId,
            })),
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

    // Fazer upload da foto com o ID do usuário
    const photoUrl = await savePhoto(photo, user.id);

    // Adicionar foto ao usuário
    await prisma.photo.create({
      data: {
        userId: user.id,
        url: photoUrl,
        isMain: true,
        order: 0,
      },
    });

    // Criar sessão
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        token: "", // Será preenchido depois
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
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Error creating account" },
      { status: 500 }
    );
  }
}