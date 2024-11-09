import { nextAuthOptions } from "@/app/lib/next-auth/opitions";
import NextAuth from "next-auth/next";

const handler = NextAuth(nextAuthOptions);

export {handler as GET, handler as POST };
