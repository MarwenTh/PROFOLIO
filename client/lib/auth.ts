import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

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
        rememberMe: { label: "Remember Me", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and password are required");
        }

        try {
          const baseUrl =
            process.env.SERVER_URL ||
            process.env.NEXT_PUBLIC_SERVER_URL ||
            "http://localhost:3001/api/auth";

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
            },
          );

          if (data && data.success && data.user) {
            return {
              id: data.user.id.toString(),
              name: data.user.name,
              email: data.user.email,
              isVerified: data.user.isVerified,
              accessToken: data.accessToken, // Updated to match backend response
              rememberMe: credentials.rememberMe === "true",
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
    maxAge: 24 * 60 * 60, // Default: 1 day in seconds
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // account and user are only available on the first call (sign in)
      if (account && user) {
        if (account.provider !== "credentials") {
          // Social Login - Sync with backend to get a valid backend token
          try {
            const baseUrl =
              process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001/api";

            const { data } = await axios.post(
              `${baseUrl}/auth/social-sync`,
              {
                email: user.email,
                name: user.name,
                image: user.image,
              },
              {
                headers: { "Content-Type": "application/json" },
              },
            );

            if (data && data.success) {
              token.accessToken = data.accessToken;
              token.id = data.user.id;
            }
          } catch (err) {
            console.error("Social sync failed:", err);
          }
        } else {
          // Credentials login - Already has backend token from authorize callback
          token.id = user.id;
          token.accessToken = (user as any).accessToken;
          token.rememberMe = (user as any).rememberMe || false;
        }

        // Set token expiration
        const maxAge = (token as any).rememberMe
          ? 7 * 24 * 60 * 60 // 7 days in seconds
          : 24 * 60 * 60; // 1 day in seconds

        token.exp = Math.floor(Date.now() / 1000) + maxAge;
      }

      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
