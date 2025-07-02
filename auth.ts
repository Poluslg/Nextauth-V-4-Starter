import NextAuth, { type User as AuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/db/prisma";

const adapter = PrismaAdapter(prisma);

const authOptions = {
  adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<AuthUser | null> {
        try {
          const email = credentials?.email as string | undefined;
          const password = credentials?.password as string | undefined;
          if (!email || !password) {
            throw new Error("Please enter a valid email and password.");
          }

          const user = await prisma.user.findUnique({ where: { email } });
          if (!user) throw new Error("Invalid user credentials.");
          if (!user.password) throw new Error("Please set a password.");
          const isPasswordMatch = await compare(
            password,
            user.password as string
          );
          if (!isPasswordMatch) throw new Error("Invalid email or password.");
          return {
            name: user.name,
            email: user.email,
            id: user?.id,
            image: user?.image,
            role: user.role,
          } as AuthUser;
        } catch (error) {
          throw new Error("Unable to proceed, Please try after some time.");
        }
      },
    }),
  ],
  callbacks: {
    signIn: async ({
      user,
      account,
    }: {
      user: AuthUser | null;
      account?: any;
    }) => {
      if (!user || !user.email) return false;

      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });
      if (existingUser) {
        await prisma.user.update({
          where: {
            email: user.email,
          },
          data: {
            lastLogin: new Date(),
          },
        });
        return true;
      } else {
        // Create a new user if it doesn't exist
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser) {
            if (existingUser.password) {
              throw new Error(
                "This email is already registered with a password. Please use the password login method."
              );
            }
          }
          if (!existingUser)
            await prisma.user.create({
              data: {
                name: user.name,
                email: user.email,
                image: user.image,
                Authenticator: "google",
                role: "USER",
                accounts: {
                  create: {
                    provider: "google",
                    providerAccountId: account.providerAccountId,
                    type: account.type,
                    access_token: account.access_token,
                    id_token: account.id_token,
                  },
                },
              },
            });
          return true;
        }
      }
      return false;
    },
    session: async ({ session, token }: { token: any; session: any }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role,
        },
      };
    },
    jwt: async ({ user, token }: { user: any; token: any }) => {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
    // error: "/auth/error",
  },
  secret: process.env.AUTH_SECRET,
  // debug: process.env.NODE_ENV !== "production",
};
//@ts-ignore
export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
