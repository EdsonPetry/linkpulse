import { supabase } from "../supabaseClient";
import type { Request, Response, NextFunction } from 'express';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
        return res.status(401).send({ error: "Authorization header is missing" });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).send({ error: "" })
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error) {
        throw new Error(error.message);
    }

    try {
        req.user = data.user
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    }

    next();
}