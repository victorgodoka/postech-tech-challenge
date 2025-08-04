import React, { useState, useMemo } from "react";
import { TransactionCard } from "@/components/TransactionCard";
import { useTransactions } from "@/hooks/redux/useTransactions";
import { Button } from "@/components/Button";
import NewTransactionForm from "@/components/NewTransactionForm";
import type { Transaction } from "@/store/slices/transactionSlice";

const Transactions: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { transactions, loading, error, deleteTransaction: deleteTransactionRedux, updateTransaction: updateTransactionRedux, refetch } = useTransactions(accountId);
  const [editModal, setEditModal] = useState<{ open: boolean; transaction?: Transaction }>({ open: false });
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 50;

  // Sort transactions by date (newest first) and calculate visible items
  const sortedTransactions = useMemo(() => {
    return transactions
      .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const visibleTransactions = useMemo(() => {
    return sortedTransactions.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage]);

  const hasMoreTransactions = sortedTransactions.length > currentPage * ITEMS_PER_PAGE;

  const loadMoreTransactions = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleDeleteTransaction = async (id: string, value?: number) => {
    const formattedValue = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format((value ?? 0) / 100);
    const tipo = (value ?? 0) < 0 ? 'Saque' : 'Depósito';
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir esse ${tipo} de valor ${formattedValue}?`);
    if (!confirmDelete) return;
    try {
      await deleteTransactionRedux(id);
      refetch(); // Refresh the transactions list
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditModal({ open: true, transaction });
  };

  return (
    <div className="rounded-md bg-white px-4 text-black overflow-auto relative max-h-[calc(100vh-200px)]">
      <div className="sticky py-4 border-b border-black/25 top-0 z-10 bg-white flex items-center gap-8 justify-between">
        <p className="font-bold text-black text-xl mb-4">Extrato</p>
        <Button variant="primary" onClick={() => setEditModal({ open: true })}>Nova Transação</Button>
      </div>

      <div className="space-y-2 pb-4">
        {visibleTransactions.map((transaction: Transaction) => (
          <TransactionCard
            key={transaction.id}
            {...transaction}
            editable
            deleteTransaction={() => handleDeleteTransaction(transaction.id, transaction.value)}
            editTransaction={() => handleEditTransaction(transaction)}
          />
        ))}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-black/25 p-4 gap-4 flex flex-col">
        {sortedTransactions.length === 0 && (
          <div className="text-center text-gray-500">
            Nenhuma transação encontrada
          </div>
        )}

        {sortedTransactions.length > 0 && (
          <div className="text-center text-sm text-gray-600">
            Mostrando {visibleTransactions.length} de {sortedTransactions.length} transações
          </div>
        )}

        {hasMoreTransactions && (
          <div className="flex justify-center">
            <Button
              variant="secondary"
              onClick={loadMoreTransactions}
            >
              Carregar mais ({sortedTransactions.length - visibleTransactions.length} restantes)
            </Button>
          </div>
        )}
      </div>

      <NewTransactionForm
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false })}
        accountId={editModal.transaction?.accountId || transactions[0]?.accountId || ""}
        transaction={editModal.transaction}
        onSubmit={async (data) => {
          try {
            if (editModal.transaction) {
              await updateTransactionRedux(editModal.transaction.id, data);
            }
            setEditModal({ open: false });
            refetch(); // Refresh the transactions list
          } catch (error) {
            console.error('Error updating transaction:', error);
          }
        }}
      />
    </div>
  );
};

export default Transactions;
