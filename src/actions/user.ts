import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

type fromData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};
export async function createUser(fromData: fromData) {
    const { email, password, firstName, lastName } = fromData;

    const name = firstName + " " + lastName;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (!user) {
            const salt = bcrypt.genSaltSync(12);
            const hashPW = bcrypt.hashSync(password, salt);
            const saveUser = await prisma.user.create({
                data: {
                    email: email as string,
                    password: hashPW,
                    Authenticator: "Credentials",
                    name: name as string,
                },
            });
            if (saveUser) {
                console.log("User created successfully:", saveUser);
                return saveUser;
            }
        }
        throw new Error("User already exists");
    } catch {
        throw new Error("Something Went Wrong");
    }
}

export async function checkEmailOfUser(email: string) {
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        });
        if (user) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error checking email:", error);
        throw new Error("Something Went Wrong");
    }

}