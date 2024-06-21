import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

type TokenPayload = {
    id: string;
    iat: number;
    exp: number;
}

export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const [, token] = authorization.split(" ");

    try {
        const decoded = verify(token, process.env.JWT_SECRET as string);
        const { id } = decoded as TokenPayload;

        req.userId = id;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}