import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required", },
                { status: 400 }
            );
        }
        // logic for user registration
        // This could involve checking if the user already exists,
        // hashing the password, and saving the user to a database.
        // For demonstration, we'll just return a success message.
        const checkUserExists = false; // Replace with actual user existence check
        if (checkUserExists) {
            return NextResponse.json(
                { error: "User already exists", },
                { status: 409 }
            );
        }
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        await prisma.user.create({
            data: {
                email,
                password: hash,
            },
        });
        return NextResponse.json(
            { message: "User registered successfully" },
            { status: 200 }
        );
    } catch {
        return NextResponse.json(
            { error: "Internal Server Error", },
            { status: 400 }
        );
    }
}
