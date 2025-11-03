import { prisma } from "@/lib/shared/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const interests = await prisma.interest.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ interests });
  } catch (error) {
    console.error("Get interests error:", error);
    return NextResponse.json(
      { error: "Error fetching interests" },
      { status: 500 }
    );
  }
}
