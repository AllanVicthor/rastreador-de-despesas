import type { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis do Supabase não configuradas no backend.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateUser = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Token de autenticação não informado.",
            });
        }

        const token = authorization.slice(7);

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            return res.status(401).json({
                message: "Token inválido ou expirado.",
            });
        }

        req.userId = data.user.id;

        next();
    } catch (error) {
        console.error("Erro na autenticação:", error);

        return res.status(401).json({
            message: "Não foi possível autenticar o usuário.",
        });
    }
};