// import { PrismaAdapter } from "@next-auth/prisma-adapter";
// import GitHubProvider from "next-auth/providers/github";

// import { NextAuthOptions } from "next-auth";
// import prisma from "../prisma";

// export const nextAuthOptions: NextAuthOptions = {
//   debug: true,
//   providers: [
//     GitHubProvider({
//       clientId: process.env.GITHUB_ID ?? "",
//       clientSecret: process.env.GITHUB_SECRET ?? "",
//     }),
//   ],
//   adapter: PrismaAdapter(prisma),
//   callbacks: {
//     async session({ session, user }) {
//       if (session.user) {
//         session.user.id = user.id;
//         session.user.image = user.image || null;
//       }
//       return session;
//     },
//   },
//   secret: process.env.NEXTAUTH_SECRET,
// };

import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "../prisma";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // 他のプロバイダーを必要に応じて追加
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.image = user.image || null;
      }
      return session;
    },
    // 必要に応じて他のコールバックを追加
  },
  // 必要に応じて他のオプションを追加
};