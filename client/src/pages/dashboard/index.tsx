import { useEffect, useState, useMemo } from "react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { supabase } from "../../supabase";

export const Dashboard = () => {
    const [firstName, setFirstName] = useState("");
    const { records } = useFinancialRecords();

    useEffect(() => {
        const loadUserName = async () => {
            const { data, error } = await supabase.auth.getUser();

            if (error || !data.user) {
                setFirstName("usuário");
                return;
            }

            const fullName = data.user.user_metadata?.full_name;

            if (typeof fullName === "string" && fullName.trim()) {
                setFirstName(fullName.trim().split(" ")[0]);
            } else {
                const email = data.user.email ?? "";
                setFirstName(email.split("@")[0]);
            }
        };

        loadUserName();
    }, []);

    const total = useMemo(() => {
        return records.reduce((sum, record) => sum + record.amount, 0);
    }, [records]);

    return (
        <div className="dashboard-container">
            <h1>
                Bem-vindo, {firstName}! Aqui estão suas finanças:
            </h1>

            <FinancialRecordForm />

            <div>Total: R$ {total.toFixed(2)}</div>

            <FinancialRecordList />
        </div>
    );
};