import { getServerSession } from "next-auth";
import Book from "./components/Book";
import { getAllBooks } from "./lib/microcms/client";
import { BookType, Purchase, User } from "./types/types";
import { nextAuthOptions } from "./lib/next-auth/options";

export default async function Home() {
  const { contents } = await getAllBooks();

  // Ensure contents is an array
  const books = Array.isArray(contents) ? contents : [];

  const session = await getServerSession(nextAuthOptions);
  const user = session?.user as User;

  let purchaseBookIds: string[] = [];

  if (user) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/purchases/${user.id}`,
        { cache: "no-store" } // SSR
      );

      const purchasesData = await response.json();

      // Ensure purchasesData is an array
      const purchasesArray = Array.isArray(purchasesData) ? purchasesData : [];

      purchaseBookIds = purchasesArray.map(
        (purchase: Purchase) => purchase.bookId.toString()
      );
    } catch (error) {
      console.error("Error fetching purchases:", error);
      // Optional: Handle the error, e.g., set purchaseBookIds to an empty array
      purchaseBookIds = [];
    }
  }

  return (
    <>
      <main className="flex flex-wrap justify-center items-center md:mt-32 mt-20">
        <h2 className="text-center w-full font-bold text-3xl mb-2">
          Book Commerce
        </h2>
        {books.map((book: BookType) => (
          <Book
            key={book.id}
            book={book}
            isPurchased={purchaseBookIds.includes(book.id.toString())}
          />
        ))}
      </main>
    </>
  );
}

