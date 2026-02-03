import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          const baseUrl = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api/auth";

          const { data } = await axios.post(
            `${baseUrl}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              timeout: 10000,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (data && data.success && data.user) {
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              isVerified: data.user.isVerified,
            };
          }

          return null;
        } catch (err: any) {
          if (axios.isAxiosError(err) && err.response) {
            throw new Error(err.response.data?.message || "Login failed");
          }
          throw new Error("An unexpected error occurred during login");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isVerified = (user as any).isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).isVerified = token.isVerified;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})
