import { useState } from "react";
import { supabase } from "../../supabase";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import "./financial-record.css";

export const FinancialRecordForm = () => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loading, setLoading] = useState(false);

    const { addRecord } = useFinancialRecords();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                alert("Você precisa estar autenticado para adicionar um registro.");
                return;
            }

            const newRecord = {
                userId: session.user.id,
                date: new Date(),
                description,
                amount: parseFloat(amount),
                category,
                paymentMethod,
            };

            await addRecord(newRecord);

            setDescription("");
            setAmount("");
            setCategory("");
            setPaymentMethod("");
        } catch (error) {
            console.error("Erro ao adicionar registro:", error);
            alert("Não foi possível adicionar o registro.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label>Descrição:</label>
                    <input
                        type="text"
                        required
                        className="input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Valor:</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        required
                        className="input"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="form-field">
                    <label>Categoria:</label>
                    <select
                        required
                        className="input"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Selecione uma categoria</option>
                        <option value="Comida">Comida</option>
                        <option value="Renda">Renda</option>
                        <option value="Salário">Salário</option>
                        <option value="Utilidades">Utilidades</option>
                        <option value="Entretenimento">Entretenimento</option>
                        <option value="Outros">Outros</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Método de pagamento:</label>
                    <select
                        required
                        className="input"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <option value="">Selecione um método de pagamento</option>
                        <option value="Cartão de crédito">Cartão de crédito</option>
                        <option value="Dinheiro">Dinheiro</option>
                        <option value="Pix">Pix</option>
                    </select>
                </div>

                <button type="submit" className="button" disabled={loading}>
                    {loading ? "Adicionando..." : "Adicionar registro"}
                </button>
            </form>
        </div>
    );
};