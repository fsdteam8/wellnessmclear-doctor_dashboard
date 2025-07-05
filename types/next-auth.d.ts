// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
      profileImage: string;
      accessToken: string;
    };
  }

  interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    profileImage: string;
    accessToken: string;
  }
}
