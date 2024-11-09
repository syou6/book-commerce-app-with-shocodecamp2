type BookType = {
    id: string;
    title: string;
    price: number;
    content: string;
    thumbnail: { url: string };
    created_at: string;
    updated_at: string;
  };
  
  type Purchase = {
    id: string;
    userId: string;
    bookId: string;
    sessionId: string;
    createdAt: string;
    user: User;
  };
  
  type User = {
    id: string;
    name?: string | null | undefined;
    email?: string | null | undefined;
    image?: string | null | undefined;
  };

  
  export type { BookType, Purchase, User };