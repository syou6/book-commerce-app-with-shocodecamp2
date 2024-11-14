// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// export async function POST(request: Request) {
//     const {title, price, bookId, userId} = await request.json();
//     // console.log(title, price);

//     try {
//         const session = await stripe.checkout.sessions.create({
//             payment_method_types: ["card"],
//             metadata: {
//                 bookId: bookId,
//             },
//             client_reference_id: userId,
//             line_items: [
//                 {
//                     price_data: {
//                         currency: "jpy",
//                         product_data: {
//                             name: title,
//                         },
//                         unit_amount: price,
//                     },
//                     quantity: 1,
//                 },
//             ],
//             mode: "payment",
//             success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
//             cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
//         });

//         return NextResponse.json({checkout_url: session.url});

//     } catch (err: unknown) {
//         if (err instanceof Error) {
//             return NextResponse.json({ error: err.message });
//         }
//         return NextResponse.json({ error: "An unknown error occurred" });
//     }
// }




import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-10-28.acacia", // 最新のStripe APIバージョンに更新
});

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export async function POST(request: Request) {
  const { title, price, bookId, userId } = await request.json();
  console.log("Received data:", { title, price, bookId, userId });

  // unit_amount が小数の場合、整数に変換（日本円の場合、1円単位）
  const unitAmount = Math.round(price * 100); // 必要に応じて調整

  try {
    // チェックアウトセッションの作成
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      metadata: {
        bookId: bookId,
      },
      client_reference_id: userId,
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: title,
            },
            unit_amount: unitAmount, // 小数点以下を避けるため修正
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/book/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
    });

    console.log("Stripe Session Created:", session.id);

    return NextResponse.json({
      checkout_url: session.url,
    });
  } catch (err: unknown) {
    console.error("Stripe Checkout Error:", err);

    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    return NextResponse.json({ error: "予期せぬエラーが発生しました。" }, { status: 500 });
  }
}