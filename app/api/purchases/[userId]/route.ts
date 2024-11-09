import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const purchase = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    console.log(purchase);

    return NextResponse.json(purchase);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ 
      error: "An error occurred", 
      details: (err as Error).message
    }, { status: 500 });
  }
}