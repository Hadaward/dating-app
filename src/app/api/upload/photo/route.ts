import { getCurrentUser } from "@/lib/server/auth/session";
import { savePhoto } from "@/lib/server/upload";
import { prisma } from "@/lib/shared/prisma";
import { uploadPhotoSchema } from "@/lib/shared/schemas/upload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Verificar autenticação
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    // Extrair dados do FormData
    const data = {
      photo: formData.get("photo") as File,
      isMain: formData.get("isMain") as string | undefined,
    };

    // Validar dados
    const validation = uploadPhotoSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error },
        { status: 400 }
      );
    }

    const { photo, isMain } = validation.data;

    // Verificar número de fotos do usuário
    const photosCount = await prisma.photo.count({
      where: { userId: user.id },
    });

    if (photosCount >= 6) {
      return NextResponse.json(
        { error: "Maximum of 6 photos reached" },
        { status: 400 }
      );
    }

    // Se for foto principal, remover isMain das outras fotos
    if (isMain) {
      await prisma.photo.updateMany({
        where: { 
          userId: user.id,
          isMain: true,
        },
        data: { isMain: false },
      });
    }

    // Fazer upload da foto
    const photoUrl = await savePhoto(photo, user.id);

    // Buscar maior ordem atual
    const maxOrder = await prisma.photo.findFirst({
      where: { userId: user.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    // Criar registro da foto
    const newPhoto = await prisma.photo.create({
      data: {
        userId: user.id,
        url: photoUrl,
        isMain: isMain || photosCount === 0,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json(
      {
        photo: {
          id: newPhoto.id,
          url: newPhoto.url,
          isMain: newPhoto.isMain,
          order: newPhoto.order,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload photo error:", error);
    return NextResponse.json(
      { error: "Error uploading photo" },
      { status: 500 }
    );
  }
}
