// import prisma from "@/app/lib/prisma";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// //購入履歴の保存
// export async function POST(request: Request) {
//     const { sessionId } = await request.json();

//     try {       
//         const session = await stripe.checkout.sessions.retrieve(sessionId);
//         const bookId = session.metadata?.bookId;
//         const userId = session.client_reference_id;

//         if (bookId && userId) {
//             const existingPurchase = await prisma.purchase.findFirst({
//                 where: {
//                     userId: userId,
//                     bookId: bookId,
//                 },
//             });

//             if (!existingPurchase) {
//                 const purchase = await prisma.purchase.create({
//                     data: {
//                         userId: userId,
//                         bookId: bookId,
//                     },
//                 });

//                 return NextResponse.json({ purchase });
//             } else {
//                 return NextResponse.json({ message: "既に購入済です。" });
//             }
//         } else {
//             return NextResponse.json({ error: "Invalid session data" });
//         }
//     } catch (err) {
//         return NextResponse.json(err);
//     }
// }




import prisma from "@/app/lib/prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

//購入履歴の保存
export async function POST(request: Request, response: Response) {
  const { sessionId } = await request.json();
  // console.log(sessionId);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log(session.metadata?.bookId); //{}
    console.log(session.client_reference_id!);

    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        userId: session.client_reference_id!,
        bookId: session.metadata?.bookId!,
      },
    });

    // 既に購入履歴が存在する場合は、新たに作成しない
    if (!existingPurchase) {
      const purchase = await prisma.purchase.create({
        data: {
          userId: session.client_reference_id!,
          bookId: session.metadata?.bookId!,
        },
      });
      return NextResponse.json({ purchase });
    } else {
      // 既に購入履歴が存在する場合の処理
      return NextResponse.json({ message: "Purchase already recorded" });
    }
  } catch (err: any) {
    return NextResponse.json({ message: err.message });
  }
}