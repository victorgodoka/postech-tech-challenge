import React, { useState, useEffect } from "react";
import { TransactionCard } from "@/components/TransactionCard";
import { Transaction } from "@/hooks/useTransaction";
import { deleteTransactionById, updateTransactionValueById, updateTransactionById } from "@/lib/api";
import { Button } from "@/components/Button";
import NewTransactionForm from "@/components/NewTransactionForm";

const Transactions: React.FC<{ transactions: Transaction[] }> = ({ transactions: initialTransactions }) => {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [editModal, setEditModal] = useState<{ open: boolean; transaction?: Transaction }>({ open: false });

  useEffect(() => {
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  const handleDeleteTransaction = async (id: string, value?: number) => {
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format((value ?? 0) / 100);
    const tipo = (value ?? 0) < 0 ? 'Saque' : 'Depósito';
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir esse ${tipo} de valor ${formattedValue}?`);
    if (!confirmDelete) return;
    await deleteTransactionById(id);
    window.location.reload();
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditModal({ open: true, transaction });
  };

  return (
    <div className="rounded-md bg-white p-4 text-black">
      <div className="flex items-center gap-8 justify-between">
        <p className="font-bold text-black text-xl mb-4">Extrato</p>
        <Button variant="primary" onClick={() => setEditModal({ open: true })}>Nova Transação</Button>
      </div>

      {transactions &&
        transactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((transaction) => (
            <TransactionCard
              key={transaction.id}
              {...transaction}
              editable
              deleteTransaction={() => handleDeleteTransaction(transaction.id, transaction.value)}
              editTransaction={() => handleEditTransaction(transaction)}
            />
          ))}

      <NewTransactionForm
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false })}
        accountId={editModal.transaction?.accountId || transactions[0]?.accountId || ""}
        transaction={editModal.transaction}
        onSubmit={async (data) => {
          if (editModal.transaction) {
            await updateTransactionById(editModal.transaction.id, data);
          }
          setEditModal({ open: false });
          window.location.reload();
        }}
      />
    </div>
  );
};

export default Transactions;
