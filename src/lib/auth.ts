import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";



export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const user = { id: "1", name: "J Smith", email: "example@example.com", password: "password" }; // Mock user for demonstration
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                try {

                    // const user = await prisma.user.findUnique({
                    //     where: {
                    //         email: credentials.email
                    //     }
                    // })

                    if (!user) {
                        throw new Error("User not found with this email");
                    }
                    if (user.email !== credentials.email) {
                        throw new Error("Invalid email or password");
                    }
                    if (user.password !== credentials.password) {
                        throw new Error("Invalid email or password");
                    }

                    // const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                    // if (!isPasswordValid) {
                    //     throw new Error("Invalid password");
                    // }
                    console.log("User found:", user);
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        name: user.name || "",
                        // image: user.image || ""
                    };

                } catch (error) {
                    console.error("Error in authorize:", error);
                    throw new Error("Something went wrong during authentication");
                }
            }

        })

    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, user, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET
}