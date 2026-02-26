/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt"
import NextAuth, { DefaultSession, User } from 'next-auth';

declare module "next-auth" {
  interface User {
    access_token?: string
    first_name?: string
    last_name?: string
  }

  interface Session {
    user: {
      access_token?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string
  }
}