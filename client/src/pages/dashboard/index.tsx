import { useEffect, useState } from "react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { supabase } from "../../supabase";
import { useMemo } from "react";

export const Dashboard = () => {
    const [firstName, setFirstName] = useState("");
    const { records } = useFinancialRecords();

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const email = data.user?.email ?? "";
            setFirstName(email.split("@")[0]);
        });
    }, []);

    const total = useMemo(() => {
        return records.reduce((sum, record) => sum + record.amount, 0);
    }, [records]);

    return (
        <div className="dashboard-container">
            <h1>
                Bem-vindo {firstName}! Aqui estão suas finanças:
            </h1>

            <FinancialRecordForm />

            <div>Total: R$ {total.toFixed(2)}</div>

            <FinancialRecordList />
        </div>
    );
};