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

export async function GET(
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        photos: {
          orderBy: { order: "asc" },
        },
        profile: true,
        interests: {
          include: {
            interest: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const mainPhoto = user.photos.find((p) => p.isMain);
    
    return NextResponse.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      age: calculateAge(user.dateOfBirth),
      avatar: mainPhoto?.url || null,
      photos: user.photos.map((p) => ({
        id: p.id,
        url: p.url,
        isMain: p.isMain,
        order: p.order,
      })),
      profile: user.profile,
      interests: user.interests.map((ui) => ({
        id: ui.interest.id,
        name: ui.interest.name,
        iconName: ui.interest.iconName,
      })),
      isCurrentUser: user.id === currentUser.id,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Error fetching user data" },
      { status: 500 }
    );
  }
}
