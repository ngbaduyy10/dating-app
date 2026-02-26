import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { fetchApi } from "./utils/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        console.log(credentials);
        const response = await fetchApi("/auth/login", {
          method: "POST",
          body: {
            email: credentials?.email,
            password: credentials?.password,
          },
        });

        if (!response.success) {
          throw new Error("Login failed");
        }

        const { access_token, user } = response.data;

        if (!user) {
          throw new Error("Invalid credentials.")
        }

        return {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          access_token: access_token,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.first_name = user.first_name
        token.last_name = user.last_name
        token.access_token = user.access_token
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.first_name = token.first_name as string
      session.user.last_name = token.last_name as string
      session.user.access_token = token.access_token as string
      return session
    },
  },
})