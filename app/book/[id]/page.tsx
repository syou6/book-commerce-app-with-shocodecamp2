import { getDetailBook, fetchBooks } from "@/app/lib/microcms/client";
import Image from "next/image";
import React from "react";

export async function generateStaticParams() {
  const books = await fetchBooks();
  if (!Array.isArray(books)) {
    return [];
  }
  return books.map((book: { id: string }) => ({
    id: book.id,
  }));
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function DetailBook({ params }: PageProps) {
  const { id } = params;
  const book = await getDetailBook(id);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <Image
          className="w-full h-80 object-cover object-center"
          src={book.thumbnail.url}
          alt={book.title}
          width={700}
          height={700}
        />
        <div className="p-4">
          <h2 className="text-2xl font-bold">{book.title}</h2>
          <div
            className="text-gray-700 mt-2"
            dangerouslySetInnerHTML={{ __html: book.content }}
          />

          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">
              公開日: {new Date(book.createdAt).toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">
              最終更新: {new Date(book.updatedAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}