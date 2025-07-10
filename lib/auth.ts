import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password", placeholder: "••••••••" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/coach/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
          console.log(res)

          const result = await res.json();
            console.log(result.message)
          if (!res.ok || !result.data?.coach) {
            throw new Error(result?.message || "Invalid login credentials");
          }

          const { coach, accessToken, refreshToken } = result.data;

          return {
            id: coach._id,
            firstName: coach.firstName,
            lastName: coach.lastName,
            email: coach.email,
            role: coach.role,
            profileImage: coach.profileImage,
            accessToken,
            refreshToken,
          };
        } catch (error) {
          console.error("Login error:", error);
          if (error instanceof Error) {
            throw new Error(error.message || "Login failed. Please check your credentials.");
          } else {
            throw new Error("Login failed. Please check your credentials.");
          }
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On first login, merge user values into token
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.email = user.email;
        token.role = user.role;
        token.profileImage = user.profileImage;
        token.accessToken = user.accessToken;
        // token.refreshToken = user.refreshToken;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        email: token.email as string,
        role: token.role as string,
        profileImage: token.profileImage as string,
        accessToken: token.accessToken as string,
        // refreshToken: token.refreshToken as string,
      };
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },
};
