import prisma from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//https://nextjs.org/docs/app/building-your-application/routing/route-handlers#dynamic-route-segments
export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  const { userId } = params;

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const purchases = await prisma.purchase.findMany({
      where: { userId: userId },
    });
    console.log("取得した購入データ:", purchases);

    return NextResponse.json(purchases);
  } catch (err) {
    console.error("Error fetching purchases:", err);
    return NextResponse.json(
      { 
        error: "An error occurred", 
        details: (err as Error).message 
      }, 
      { status: 500 }
    );
  }
}