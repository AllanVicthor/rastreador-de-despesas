import { useEffect, useState, useMemo } from "react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { supabase } from "../../supabase";

export const Dashboard = () => {
    const [firstName, setFirstName] = useState("");
    const [fullName, setFullName] = useState("");
    const [message, setMessage] = useState("");
    const [saving, setSaving] = useState(false);

    const { records } = useFinancialRecords();

    useEffect(() => {
        const loadUserName = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                setFirstName("usuário");
                return;
            }

            const savedName = data.user.user_metadata?.full_name;

            if (typeof savedName === "string" && savedName.trim()) {
                setFullName(savedName);
                setFirstName(savedName.trim().split(/\s+/)[0]);
            } else {
                const email = data.user.email ?? "";
                const fallbackName = email.split("@")[0];

                setFullName(fallbackName);
                setFirstName(fallbackName);
            }
        };

        loadUserName();
    }, []);

    const handleUpdateName = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const name = fullName.trim();

        if (!name) {
            setMessage("Digite seu nome antes de salvar.");
            return;
        }

        setSaving(true);
        setMessage("");

        const { error } = await supabase.auth.updateUser({
            data: {
                full_name: name,
            },
        });

        setSaving(false);

        if (error) {
            setMessage("Não foi possível atualizar seu nome.");
            return;
        }

        setFirstName(name.split(/\s+/)[0]);
        setMessage("Nome atualizado com sucesso!");
    };

    const total = useMemo(() => {
        return records.reduce((sum, record) => sum + record.amount, 0);
    }, [records]);

    return (
        <div className="dashboard-container">
            <h1>
                Bem-vindo, {firstName}! Aqui estão suas finanças:
            </h1>

            <section>
                <h2>Meu perfil</h2>

                <form onSubmit={handleUpdateName}>
                    <label htmlFor="fullName">Seu nome:</label>

                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Digite seu nome"
                        required
                    />

                    <button type="submit" disabled={saving}>
                        {saving ? "Salvando..." : "Salvar nome"}
                    </button>
                </form>

                {message && <p>{message}</p>}
            </section>

            <FinancialRecordForm />

            <div>Total: R$ {total.toFixed(2)}</div>

            <FinancialRecordList />
        </div>
    );
};