import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";

export const Dashboard = () => {
    const { user } = useUser();
    const { records } = useFinancialRecords();

    const total = useMemo(() => {
        let totalAmount = 0;
        records.forEach((record) => {
            totalAmount += record.amount
        });

        return totalAmount;
    }, [records]);
    return (
        <div className="dashboard-container">
            <h1>Bem-Vindo {user?.firstName}! Aqui estão as suas finanças:</h1>
            <FinancialRecordForm />
            <div>Total: R$ {total}</div>
            <FinancialRecordList />
        </div>
    );
};

