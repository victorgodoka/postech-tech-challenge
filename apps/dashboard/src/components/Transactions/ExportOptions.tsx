/**
 * Componente de Opções de Exportação - Tech Challenge POSTECH
 * Permite exportar transações em diferentes formatos
 */

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/slices/transactionSlice';
import { Button } from '../Button';

interface ExportOptionsProps {
  transactions: Transaction[];
  className?: string;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  transactions,
  className = ""
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(Math.abs(value));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
      const csvContent = [
        headers.join(','),
        ...transactions.map(transaction => [
          formatDate(transaction.date),
          transaction.type,
          transaction.category || 'Sem categoria',
          `"${transaction.id}"`, // Usando ID como descrição temporariamente
          transaction.value.toString().replace('.', ',')
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transacoes_${new Date().toISOString().slice(0, 10)}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowOptions(false);
    } catch (error) {
      console.error('Erro ao exportar CSV:', error);
      alert('Erro ao exportar arquivo CSV');
    } finally {
      setIsExporting(false);
    }
  };

  const exportToJSON = () => {
    setIsExporting(true);
    
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        totalTransactions: transactions.length,
        transactions: transactions.map(transaction => ({
          ...transaction,
          formattedValue: formatCurrency(transaction.value),
          formattedDate: formatDate(transaction.date)
        }))
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transacoes_${new Date().toISOString().slice(0, 10)}.json`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowOptions(false);
    } catch (error) {
      console.error('Erro ao exportar JSON:', error);
      alert('Erro ao exportar arquivo JSON');
    } finally {
      setIsExporting(false);
    }
  };

  const printTransactions = () => {
    const printContent = `
      <html>
        <head>
          <title>Extrato de Transações</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .transaction { 
              border-bottom: 1px solid #eee; 
              padding: 10px 0; 
              display: flex; 
              justify-content: space-between; 
            }
            .transaction:last-child { border-bottom: none; }
            .positive { color: green; }
            .negative { color: red; }
            .summary { 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 2px solid #333; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Extrato de Transações</h1>
            <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>
            <p>Total de transações: ${transactions.length}</p>
          </div>
          
          <div class="transactions">
            ${transactions.map(transaction => `
              <div class="transaction">
                <div>
                  <strong>${formatDate(transaction.date)}</strong><br>
                  ${transaction.type} - ${transaction.category || 'Sem categoria'}
                </div>
                <div class="${transaction.value >= 0 ? 'positive' : 'negative'}">
                  ${formatCurrency(transaction.value)}
                </div>
              </div>
            `).join('')}
          </div>
          
          <div class="summary">
            <h3>Resumo</h3>
            <p><strong>Total de Receitas:</strong> ${formatCurrency(
              transactions.filter(t => t.value > 0).reduce((sum, t) => sum + t.value, 0)
            )}</p>
            <p><strong>Total de Despesas:</strong> ${formatCurrency(
              Math.abs(transactions.filter(t => t.value < 0).reduce((sum, t) => sum + t.value, 0))
            )}</p>
            <p><strong>Saldo:</strong> ${formatCurrency(
              transactions.reduce((sum, t) => sum + t.value, 0)
            )}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
    
    setShowOptions(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setShowOptions(!showOptions)}
        disabled={transactions.length === 0 || isExporting}
        variant="secondary"
      >
        <Icon 
          icon={isExporting ? "mdi:loading" : "mdi:download"} 
          className={`h-4 w-4 ${isExporting ? 'animate-spin' : ''}`} 
        />
        <span>{isExporting ? 'Exportando...' : 'Exportar'}</span>
        <Icon icon="mdi:chevron-down" className="h-4 w-4" />
      </Button>

      {showOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 
                      rounded-md shadow-lg z-50">
          <div className="py-1">
            <button
              onClick={exportToCSV}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700
                       hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:file-delimited" className="h-4 w-4 mr-3 text-green-600" />
              Exportar CSV
            </button>
            
            <button
              onClick={exportToJSON}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700
                       hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:code-json" className="h-4 w-4 mr-3 text-blue-600" />
              Exportar JSON
            </button>
            
            <hr className="my-1" />
            
            <button
              onClick={printTransactions}
              disabled={isExporting}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700
                       hover:bg-gray-100 focus:bg-gray-100 focus:outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon icon="mdi:printer" className="h-4 w-4 mr-3 text-gray-600" />
              Imprimir
            </button>
          </div>
        </div>
      )}

      {/* Overlay para fechar dropdown */}
      {showOptions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
};
