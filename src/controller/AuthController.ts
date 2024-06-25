import { Request, RequestHandler, Response } from "express";
import { prisma } from "../utils/prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import * as yup from 'yup';

interface IUser {
    email: string;
    password: string;
}

const bodyValidation: yup.Schema<IUser> = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
})

export const authBodyValidation: RequestHandler = async (req, res, next) => {
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

export class AuthController {

    async authenticate(req: Request<{}, {}, IUser>, res: Response) {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({where: { email }});

        if (!user) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: "Invalid Email or Password" });
        }

        const token = sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        const { id } = user;

        return res.json({ user: { id, email }, token });
    }
}