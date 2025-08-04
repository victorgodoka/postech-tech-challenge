/**
 * Paginação para Transações - Requisito Tech Challenge
 * Implementa paginação e scroll infinito para grandes volumes de dados
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/slices/transactionSlice';
import { Button } from '../Button';
import { Input } from '../Input';

interface TransactionPaginationProps {
  transactions: Transaction[];
  itemsPerPage?: number;
  onPageChange: (paginatedTransactions: Transaction[], currentPage: number, totalPages: number) => void;
  enableInfiniteScroll?: boolean;
}

export const TransactionPagination: React.FC<TransactionPaginationProps> = ({
  transactions,
  itemsPerPage = 10,
  onPageChange,
  enableInfiniteScroll = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedTransactions, setDisplayedTransactions] = useState<Transaction[]>([]);
  
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const totalItems = transactions.length;

  useEffect(() => {
    if (enableInfiniteScroll) {
      // Scroll infinito: mostrar todas as transações até a página atual
      const endIndex = currentPage * itemsPerPage;
      const paginatedData = transactions.slice(0, endIndex);
      setDisplayedTransactions(paginatedData);
      onPageChange(paginatedData, currentPage, totalPages);
    } else {
      // Paginação tradicional: mostrar apenas as transações da página atual
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = transactions.slice(startIndex, endIndex);
      setDisplayedTransactions(paginatedData);
      onPageChange(paginatedData, currentPage, totalPages);
    }
  }, [transactions, currentPage, itemsPerPage, enableInfiniteScroll, onPageChange, totalPages]);

  // Reset para primeira página quando as transações mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [transactions]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => goToPage(1);
  const goToLastPage = () => goToPage(totalPages);
  const goToPreviousPage = () => goToPage(currentPage - 1);
  const goToNextPage = () => goToPage(currentPage + 1);

  const loadMore = () => {
    if (enableInfiniteScroll && currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Gerar números de páginas para exibir
  const getPageNumbers = () => {
    const delta = 2; // Quantas páginas mostrar antes e depois da atual
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) {
    return null; // Não mostrar paginação se houver apenas uma página
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Informações da paginação */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-600">
          {enableInfiniteScroll ? (
            <>
              Mostrando <span className="font-medium">{displayedTransactions.length}</span> de{' '}
              <span className="font-medium">{totalItems}</span> transações
            </>
          ) : (
            <>
              Mostrando{' '}
              <span className="font-medium">
                {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}
              </span>{' '}
              a{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalItems)}
              </span>{' '}
              de <span className="font-medium">{totalItems}</span> transações
            </>
          )}
        </div>

        {/* Seletor de itens por página */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Itens por página:</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              const newItemsPerPage = parseInt(e.target.value);
              // Aqui você pode adicionar uma prop para alterar itemsPerPage
              // Por enquanto, apenas mostra o valor atual
            }}
            className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {enableInfiniteScroll ? (
        /* Scroll Infinito */
        <div className="text-center">
          {currentPage < totalPages ? (
            <Button
              onClick={loadMore}
              variant="secondary"
            >
              <Icon icon="mdi:loading" className="w-4 h-4 mr-2 animate-spin" />
              Carregar mais transações
            </Button>
          ) : (
            <p className="text-sm text-gray-500">
              Todas as transações foram carregadas
            </p>
          )}
        </div>
      ) : (
        /* Paginação Tradicional */
        <div className="flex items-center justify-between">
          {/* Navegação anterior */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToFirstPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Primeira página"
            >
              <Icon icon="mdi:chevron-double-left" className="w-4 h-4" />
            </button>
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Página anterior"
            >
              <Icon icon="mdi:chevron-left" className="w-4 h-4" />
            </button>
          </div>

          {/* Números das páginas */}
          <div className="flex items-center space-x-1">
            {getPageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(pageNumber as number)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Navegação posterior */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Próxima página"
            >
              <Icon icon="mdi:chevron-right" className="w-4 h-4" />
            </button>
            <button
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Última página"
            >
              <Icon icon="mdi:chevron-double-right" className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navegação rápida */}
      {!enableInfiniteScroll && totalPages > 10 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-2">
            <label className="text-sm text-gray-600">Ir para página:</label>
            <input
              type="number"
              min={1}
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  goToPage(page);
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-sm text-gray-600">de {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPagination;
