import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import "./financial-record.css";

export const FinancialRecordForm = () => {
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [paymentMethod, setPaymentMethod] = useState<string>("");
    const { addRecord } = useFinancialRecords();

    const { user } = useUser();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const newRecord = {
            userId: user?.id ?? "",
            date: new Date(),
            description: description,
            amount: parseFloat(amount),
            category: category,
            paymentMethod: paymentMethod,
        };

        addRecord(newRecord);
        setDescription("");
        setAmount("");
        setCategory("");
        setPaymentMethod("");
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
                <button type="submit" className="button">
                    Adicionar registro
                </button>
            </form>
        </div>
    );
};