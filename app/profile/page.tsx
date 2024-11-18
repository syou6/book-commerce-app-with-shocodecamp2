import { getServerSession } from "next-auth";
import Image from "next/image";
import { nextAuthOptions } from "../lib/next-auth/options";
import { BookType, Purchase, User } from "../types/types";
import { getDetailBook } from "../lib/microcms/client";
import PurchaseDetailBook from "../components/PurchaseDetailBook";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await getServerSession(nextAuthOptions);
    const user = session?.user as User | null;

    if (!user) {
        redirect("/api/auth/signin");
    }

    console.log("取得したユーザーID:", user?.id);

    let purchaseDetailBooks: BookType[] = [];

    if (user) {
        try {
            const response = await fetch(
                `/api/purchases/${user.id}`,
                { cache: "no-store" } //SSR
            );

            if (!response.ok) {
                throw new Error("購入データの取得に失敗しました。");
            }

            const purchasesData: Purchase[] = await response.json();

            console.log("取得した購入データ:", purchasesData);

            purchaseDetailBooks = await Promise.all(
                purchasesData.map(async (purchase: Purchase) => {
                    return await getDetailBook(purchase.bookId);
                })
            );
        } catch (error) {
            console.error("Error fetching purchases:", error);
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">プロフィール</h1>

            <div className="bg-white shadow-md rounded p-4">
                <div className="flex items-center">
                    <Image
                        priority
                        src={user.image || "/default_icon.png"}
                        alt="user profile_icon"
                        width={60}
                        height={60}
                        className="rounded-t-md"
                    />
                    <h2 className="text-lg ml-4 font-semibold">お名前：{user.name}</h2>
                </div>
            </div>

            <span className="font-medium text-lg mb-4 mt-4 block">購入した記事</span>
            <div className="flex items-center gap-6">
                {purchaseDetailBooks.length > 0 ? (
                    purchaseDetailBooks.map((purchaseDetailBook: BookType) => (
                        <PurchaseDetailBook 
                            key={purchaseDetailBook.id}
                            purchaseDetailBook={purchaseDetailBook} 
                        />
                    ))
                ) : (
                    <p>購入履歴がありません。</p>
                )}
            </div>
        </div>
    );
}
