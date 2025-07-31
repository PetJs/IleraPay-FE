import React from "react";
import List from "@/components/list";
import type { Transaction } from "@/lib/types";

const mockData: { transactions: Transaction[] } = {
  transactions: [
    // example items; swap these out or leave empty to test “no history”
    {
      date: "2025-07-31T14:23:00Z",
      tag: "in",
      amount: 1200.5,
      title: "Salary Deposit",
    },
    {
      date: "2025-07-30T09:15:32Z",
      tag: "out",
      amount: 45.0,
      title: "Coffee Shop",
    },
    {
      date: "2025-07-29T18:47:10Z",
      tag: "out",
      amount: 150.0,
      title: "Groceries",
    },
    {
      date: "2025-07-28T12:00:00Z",
      tag: "in",
      amount: 200.0,
      title: "Refund",
    },
    {
      date: "2025-07-29T18:47:10Z",
      tag: "out",
      amount: 150.0,
      title: "Groceries",
    },
    {
      date: "2025-07-28T12:00:00Z",
      tag: "in",
      amount: 200.0,
      title: "Refund",
    },
  ],
};

const TransactionPage: React.FC = () => {
  const { transactions } = mockData;

  return (
    <div className="p-2">
      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <List data={transactions} />
      )}
    </div>
  );
};

export default TransactionPage;
