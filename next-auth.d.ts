declare module "next-auth" {
  interface User {
    name?: string;
    email?: string;
    image?: string;
    id?: string;
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    role?: string;
  }
}
