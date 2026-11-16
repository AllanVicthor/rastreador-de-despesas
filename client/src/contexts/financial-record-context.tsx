import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";

export interface FinancialRecord {
    _id?: string;
    userId: string;
    date: Date;
    description: string;
    amount: number;
    category: string;
    paymentMethod: string;
}

interface FinancialRecordsContextType {
    records: FinancialRecord[];
    addRecord: (record: FinancialRecord) => void;
    updateRecord: (id: string, newRecord: FinancialRecord) => void;
    deleteRecord: (id: string) => void;
}

const API_URL = "https://rastreador-de-despesas.onrender.com/financial-records";

export const FinancialRecordsContext = createContext<
    FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [records, setRecords] = useState<FinancialRecord[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setUserId(data.session?.user.id ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user.id ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const getAuthHeaders = async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            throw new Error("Usuário não autenticado.");
        }

        return {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
        };
    };

    const fetchRecords = async () => {
        if (!userId) {
            setRecords([]);
            return;
        }

        try {
            const headers = await getAuthHeaders();

            const response = await fetch(
                `${API_URL}/getAllByUserID/${userId}`,
                { headers }
            );

            if (response.ok) {
                const data = await response.json();
                setRecords(data);
            } else {
                console.error("Erro ao buscar registros:", response.status);
            }
        } catch (error) {
            console.error("Erro ao buscar registros:", error);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [userId]);

    const addRecord = async (record: FinancialRecord) => {
        try {
            const headers = await getAuthHeaders();

            const response = await fetch(`${API_URL}/`, {
                method: "POST",
                body: JSON.stringify(record),
                headers,
            });

            if (response.ok) {
                const newRecord = await response.json();
                setRecords((prev) => [...prev, newRecord]);
            } else {
                console.error("Erro ao adicionar registro:", response.status);
            }
        } catch (error) {
            console.error("Erro ao adicionar registro:", error);
        }
    };

    const updateRecord = async (id: string, newRecord: FinancialRecord) => {
        try {
            const headers = await getAuthHeaders();

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                body: JSON.stringify(newRecord),
                headers,
            });

            if (response.ok) {
                const updatedRecord = await response.json();

                setRecords((prev) =>
                    prev.map((record) =>
                        record._id === id ? updatedRecord : record
                    )
                );
            } else {
                console.error("Erro ao atualizar registro:", response.status);
            }
        } catch (error) {
            console.error("Erro ao atualizar registro:", error);
        }
    };

    const deleteRecord = async (id: string) => {
        try {
            const headers = await getAuthHeaders();

            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers,
            });

            if (response.ok) {
                const deletedRecord = await response.json();

                setRecords((prev) =>
                    prev.filter((record) => record._id !== deletedRecord._id)
                );
            } else {
                console.error("Erro ao excluir registro:", response.status);
            }
        } catch (error) {
            console.error("Erro ao excluir registro:", error);
        }
    };

    return (
        <FinancialRecordsContext.Provider
            value={{ records, addRecord, updateRecord, deleteRecord }}
        >
            {children}
        </FinancialRecordsContext.Provider>
    );
};

export const useFinancialRecords = () => {
    const context = useContext<FinancialRecordsContextType | undefined>(
        FinancialRecordsContext
    );

    if (!context) {
        throw new Error(
            "useFinancialRecords must be used within a FinancialRecordsProvider"
        );
    }

    return context;
};