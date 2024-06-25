import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";
import { hash } from "bcryptjs";
import * as yup from 'yup';

interface IUser {
    name: string;
    email: string;
    password: string;
}

const bodyValidation: yup.Schema<IUser> = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(8).required()
})

export const createBodyValidation: RequestHandler = async (req, res, next) => {
    try {
        await bodyValidation.validate(req.body, { abortEarly: false });
        return next();
    } catch (error) {
        const yupError = error as yup.ValidationError;
        const errors: Record<string, string> = {};

        yupError.inner.forEach((error) => {
            if (!error.path) return;

            errors[error.path] = error.message;
        });

        return res.status(400).json({ errors });
    }
}

export class UserController {
    async index(req: Request, res: Response) {
        const users = await prisma.user.findMany();
        return res.json({ users });
    }

    async createUser(req: Request<{}, {}, IUser>, res: Response) {
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