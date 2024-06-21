import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { hash } from "bcryptjs";

export class UserController {
    async index(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        return res.json({ users });
    }

    async createUser(req: Request, res: Response) {
        const { name, email, password } = req.body

        const userExist = await prisma.user.findUnique({where: { email }});

        if (userExist) {
            return res.status(400).json({ message: "User already exist" });
        }

        const hash_password = await hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name, 
                email, 
                password: hash_password
            }
        });

        return res.json({ user })
    }
}