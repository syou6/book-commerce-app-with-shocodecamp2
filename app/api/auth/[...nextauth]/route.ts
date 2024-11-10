import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import { nextAuthOptions } from '../../../lib/next-auth/opitions';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  try {
    return await NextAuth(req, res, nextAuthOptions);
  } catch (error) {
    console.error('NextAuth Error:', error);
    res.status(500).json({ error: '認証エラーが発生しました' });
  }
}
