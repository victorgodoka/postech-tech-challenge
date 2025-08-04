/**
 * Componente de Listagem de Transações - Tech Challenge POSTECH
 * Requisitos implementados:
 * - Filtros avançados e busca
 * - Paginação ou scroll infinito
 * - Validação avançada
 * - Sugestões automáticas de categorias
 * - Upload de recibos/documentos (preparado)
 */

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { TransactionCard } from "@/components/TransactionCard";
import { useTransactions } from "@/hooks/redux/useTransactions";
import { Button } from "@/components/Button";
import NewTransactionForm from "@/components/NewTransactionForm";
import { AdvancedFilters } from "@/components/Transactions/AdvancedFilters";
import { Icon } from "@iconify/react";
import type { Transaction } from "@/store/slices/transactionSlice";

// Usar a interface do AdvancedFilters existente
interface LocalFilterOptions {
  dateRange: { start: string; end: string };
  categories: string[];
  types: string[];
  valueRange: { min: number; max: number };
  searchTerm: string;
}

interface SortOptions {
  field: 'date' | 'value' | 'category' | 'type';
  direction: 'asc' | 'desc';
}

const Transactions: React.FC<{ accountId: string }> = ({ accountId }) => {
  const { transactions, loading, error, deleteTransaction: deleteTransactionRedux, updateTransaction: updateTransactionRedux, refetch } = useTransactions(accountId);

  const [editModal, setEditModal] = useState<{ open: boolean; transaction?: Transaction }>({ open: false });
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortOptions, setSortOptions] = useState<SortOptions>({ field: 'date', direction: 'desc' });

  const [filters, setFilters] = useState<LocalFilterOptions>({
    dateRange: { start: '', end: '' },
    categories: [],
    types: [],
    valueRange: { min: 0, max: 0 },
    searchTerm: ''
  });

  const ITEMS_PER_PAGE = 25; // Reduzido para melhor performance

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(transaction =>
        (transaction.category?.toLowerCase().includes(searchLower)) ||
        (transaction.type?.toLowerCase().includes(searchLower)) ||
        (transaction.id?.toLowerCase().includes(searchLower))
      );
    }

    if (filters.dateRange.start) {
      filtered = filtered.filter(transaction =>
        transaction.date >= filters.dateRange.start
      );
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(transaction =>
        transaction.date <= filters.dateRange.end
      );
    }

    if (filters.categories.length > 0) {
      filtered = filtered.filter(transaction =>
        transaction.category && filters.categories.includes(transaction.category)
      );
    }

    if (filters.types.length > 0) {
      filtered = filtered.filter(transaction => {
        // Mapear os tipos do filtro para os tipos reais das transações
        const transactionTypeMap: { [key: string]: string[] } = {
          'income': ['Depósito'],
          'expense': ['Saque']
        };
        
        return filters.types.some(filterType => {
          const mappedTypes = transactionTypeMap[filterType];
          return mappedTypes ? mappedTypes.includes(transaction.type) : filters.types.includes(transaction.type);
        });
      });
    }

    if (filters.valueRange.min !== 0 || filters.valueRange.max !== 0) {
      filtered = filtered.filter(transaction => {
        const absValue = Math.abs(transaction.value);
        return absValue >= filters.valueRange.min &&
          (filters.valueRange.max === 0 || absValue <= filters.valueRange.max);
      });
    }

    return filtered;
  }, [transactions, filters]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a: Transaction, b: Transaction) => {
      let aValue: any, bValue: any;

      switch (sortOptions.field) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'value':
          aValue = Math.abs(a.value);
          bValue = Math.abs(b.value);
          break;
        case 'category':
          aValue = a.category || '';
          bValue = b.category || '';
          break;
        case 'type':
          aValue = a.type;
          bValue = b.type;
          break;
        default:
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
      }

      if (sortOptions.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [filteredTransactions, sortOptions]);

  const visibleTransactions = useMemo(() => {
    return sortedTransactions.slice(0, currentPage * ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage]);

  const hasMoreTransactions = sortedTransactions.length > currentPage * ITEMS_PER_PAGE;
  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);

  const loadMoreTransactions = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFiltersChange = useCallback((newFilters: LocalFilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  const handleAdvancedFiltersChange = useCallback((newFilters: any) => {
    setFilters({
      dateRange: { start: newFilters.dateFrom, end: newFilters.dateTo },
      categories: newFilters.category ? [newFilters.category] : [],
      types: newFilters.transactionType !== 'all' ? [newFilters.transactionType] : [],
      valueRange: {
        min: parseFloat(newFilters.valueMin) || 0,
        max: parseFloat(newFilters.valueMax) || 0
      },
      searchTerm: newFilters.searchTerm
    });
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((searchTerm: string) => {
    setFilters((prev: LocalFilterOptions) => ({ ...prev, searchTerm }));
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((field: SortOptions['field']) => {
    setSortOptions(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      dateRange: { start: '', end: '' },
      categories: [],
      types: [],
      valueRange: { min: 0, max: 0 },
      searchTerm: ''
    });
    setCurrentPage(1);
  }, []);

  const handlePaginationChange = useCallback((paginatedTransactions: Transaction[], currentPage: number, totalPages: number) => {
    setCurrentPage(currentPage);
  }, []);

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
      refetch();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditModal({ open: true, transaction });
  };

  if (loading) {
    return (
      <div className="rounded-md bg-white px-4 text-black flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Carregando transações...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-white p-4 mx-auto w-full max-w-3xl text-black flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Icon icon="mdi:alert-circle" color="red" className="w-16 h-16" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erro ao carregar transações</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button variant="primary" onClick={refetch}>
              Tentar novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-white text-black overflow-hidden">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Icon icon="mdi:database" className="w-4 h-4" />
              <span>{sortedTransactions.length} transações</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon icon="mdi:filter" className="w-4 h-4 mr-2" />
              Filtros
              {(filters.searchTerm || filters.categories.length > 0 || filters.types.length > 0) && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                  {[filters.searchTerm, ...filters.categories, ...filters.types].filter(Boolean).length}
                </span>
              )}
            </Button>
            <Button
              variant="primary"
              onClick={() => setEditModal({ open: true })}
            >
              <Icon icon="mdi:plus" className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="border-b border-gray-200 bg-gray-50">
          <AdvancedFilters
            transactions={transactions}
            onFiltersChange={handleAdvancedFiltersChange}
            onFilteredTransactions={() => { }} // Não usado aqui
          />
        </div>
      )}

      {/* Barra de ferramentas com ordenação e visualização */}
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
            <div className="flex items-center space-x-2">
              {[
                { field: 'date' as const, label: 'Data', icon: 'mdi:calendar' },
                { field: 'value' as const, label: 'Valor', icon: 'mdi:currency-usd' },
                { field: 'category' as const, label: 'Categoria', icon: 'mdi:tag' },
                { field: 'type' as const, label: 'Tipo', icon: 'mdi:swap-horizontal' }
              ].map(({ field, label, icon }) => (
                <button
                  key={field}
                  onClick={() => handleSortChange(field)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm transition-colors ${sortOptions.field === field
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  <Icon icon={icon} className="w-4 h-4" />
                  <span>{label}</span>
                  {sortOptions.field === field && (
                    <Icon
                      icon={sortOptions.direction === 'asc' ? 'mdi:arrow-up' : 'mdi:arrow-down'}
                      className="w-3 h-3"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {(filters.searchTerm || filters.categories.length > 0 || filters.types.length > 0) && (
              <button
                onClick={resetFilters}
                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
              >
                <Icon icon="mdi:filter-off" className="w-4 h-4" />
                <span>Limpar filtros</span>
              </button>
            )}

            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon icon="mdi:view-list" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid'
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <Icon icon="mdi:view-grid" className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de transações */}
      <div className="overflow-auto max-h-[calc(100vh-400px)]">
        {sortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Icon icon="mdi:receipt" className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filters.searchTerm || filters.categories.length > 0 || filters.types.length > 0
                ? 'Nenhuma transação encontrada'
                : 'Nenhuma transação cadastrada'
              }
            </h3>
            <p className="text-gray-600 mb-6 max-w-md">
              {filters.searchTerm || filters.categories.length > 0 || filters.types.length > 0
                ? 'Tente ajustar os filtros ou termos de busca para encontrar transações.'
                : 'Comece adicionando sua primeira transação financeira.'
              }
            </p>
            {filters.searchTerm || filters.categories.length > 0 || filters.types.length > 0 ? (
              <Button variant="secondary" onClick={resetFilters}>
                Limpar filtros
              </Button>
            ) : (
              <Button variant="primary" onClick={() => setEditModal({ open: true })}>
                Adicionar Transação
              </Button>
            )}
          </div>
        ) : (
          <div className={`p-6 ${viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-3'
            }`}>
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
        )}
      </div>

      {/* Paginação Simples */}
      {sortedTransactions.length > 0 && (
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{visibleTransactions.length}</span> de{' '}
              <span className="font-medium">{sortedTransactions.length}</span> transações
            </div>

            <div className="flex items-center space-x-3">
              {currentPage > 1 && (
                <Button
                  variant="secondary"
                  onClick={() => setCurrentPage(1)}
                >
                  <Icon icon="mdi:chevron-double-left" className="w-4 h-4 mr-1" />
                  Início
                </Button>
              )}

              {hasMoreTransactions && (
                <Button
                  variant="primary"
                  onClick={loadMoreTransactions}
                >
                  Carregar mais ({sortedTransactions.length - visibleTransactions.length} restantes)
                  <Icon icon="mdi:chevron-down" className="w-4 h-4 ml-1" />
                </Button>
              )}

              <div className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>
          </div>
        </div>
      )}

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
