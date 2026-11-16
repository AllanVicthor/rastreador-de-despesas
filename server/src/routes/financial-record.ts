import express, { type Response } from "express";
import mongoose from "mongoose";
import FinancialRecordModel from "../schema/financial-record.js";
import {
    authenticateUser,
    type AuthenticatedRequest,
} from "../middleware/auth.js";

const router = express.Router();

// Todas as rotas exigem autenticação
router.use(authenticateUser);

// Buscar registros do usuário autenticado
router.get(
    "/getAllByUserID/:userId",
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Usuário não autenticado.",
                });
            }

            const records = await FinancialRecordModel.find({ userId });

            return res.status(200).json(records);
        } catch (error) {
            console.error("Erro ao buscar registros:", error);

            return res.status(500).json({
                message: "Erro ao buscar registros.",
            });
        }
    }
);

// Criar registro
router.post(
    "/",
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Usuário não autenticado.",
                });
            }

            const newRecord = new FinancialRecordModel({
                ...req.body,
                userId: userId,
            });

            const savedRecord = await newRecord.save();

            return res.status(201).json(savedRecord);
        } catch (error) {
            console.error("Erro ao criar registro:", error);

            return res.status(500).json({
                message: "Erro ao criar registro.",
            });
        }
    }
);

// Atualizar registro pertencente ao usuário
router.put(
    "/:id",
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Usuário não autenticado.",
                });
            }

            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    message: "ID inválido.",
                });
            }

            const { userId: _ignoredUserId, ...updateData } = req.body;

            const updatedRecord =
                await FinancialRecordModel.findOneAndUpdate(
                    {
                        _id: req.params.id,
                        userId: userId,
                    },
                    updateData,
                    {
                        new: true,
                        runValidators: true,
                    }
                );

            if (!updatedRecord) {
                return res.status(404).json({
                    message: "Registro não encontrado.",
                });
            }

            return res.status(200).json(updatedRecord);
        } catch (error) {
            console.error("Erro ao atualizar registro:", error);

            return res.status(500).json({
                message: "Erro ao atualizar registro.",
            });
        }
    }
);

// Excluir registro pertencente ao usuário
router.delete(
    "/:id",
    async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.userId;

            if (!userId) {
                return res.status(401).json({
                    message: "Usuário não autenticado.",
                });
            }

            if (!mongoose.isValidObjectId(req.params.id)) {
                return res.status(400).json({
                    message: "ID inválido.",
                });
            }

            const deletedRecord =
                await FinancialRecordModel.findOneAndDelete({
                    _id: req.params.id,
                    userId: userId,
                });

            if (!deletedRecord) {
                return res.status(404).json({
                    message: "Registro não encontrado.",
                });
            }

            return res.status(200).json(deletedRecord);
        } catch (error) {
            console.error("Erro ao excluir registro:", error);

            return res.status(500).json({
                message: "Erro ao excluir registro.",
            });
        }
    }
);

export default router;