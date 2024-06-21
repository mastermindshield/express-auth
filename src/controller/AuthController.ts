import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

export class AuthController {

    async authenticate(req: Request, res: Response) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({where: { email }});

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        const { id } = user;

        return res.json({ user: { id, email }, token });
    }
}