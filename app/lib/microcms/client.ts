import { BookType } from '@/app/types/types';
import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_SERVICE_DOMAIN!, 
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
});

export const getAllBooks = async () => {
    const allBooks = await client.getList<BookType>({
        endpoint: "e-book",
        customRequestInit: {
          cache: "no-store",
          },
    });
    return allBooks;
};

export const getDetailBook = async (contentId: string) => {
  const detailBook = await client.getListDetail<BookType>({
    endpoint: "e-book",
    contentId,
    customRequestInit: {
      cache: "no-store",
    },
  });
  return detailBook;
};

export async function fetchBooks() {
  // fetchBooksの実装
};