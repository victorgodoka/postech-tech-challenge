'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/slices/transactionSlice';
import { Input } from '../Input';
import { Select } from '../Select';

export interface FilterOptions {
  searchTerm: string;
  dateFrom: string;
  dateTo: string;
  category: string;
  transactionType: 'all' | 'income' | 'expense';
  valueMin: string;
  valueMax: string;
  sortBy: 'date' | 'value' | 'category';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  transactions: Transaction[];
  onFilteredTransactions: (filtered: Transaction[]) => void;
  onFiltersChange: (filters: FilterOptions) => void;
}

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  transactions,
  onFilteredTransactions,
  onFiltersChange
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    transactionType: 'all',
    valueMin: '',
    valueMax: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Extrair categorias únicas das transações
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(
        transactions
          .map(tx => tx.category)
          .filter((category): category is string => Boolean(category))
      )
    ).sort();
    setCategories(uniqueCategories);
  }, [transactions]);

  // Aplicar filtros sempre que mudarem
  useEffect(() => {
    const filtered = applyFilters(transactions, filters);
    onFilteredTransactions(filtered);
    // onFiltersChange deve ser chamado apenas quando o usuário interage com os filtros
  }, [filters, transactions, onFilteredTransactions]);

  const applyFilters = (txs: Transaction[], filterOptions: FilterOptions): Transaction[] => {
    let filtered = [...txs];

    // Busca textual
    if (filterOptions.searchTerm) {
      const searchLower = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(tx => 
        tx.type.toLowerCase().includes(searchLower) ||
        (tx.category?.toLowerCase().includes(searchLower)) ||
        tx.value.toString().includes(searchLower) ||
        tx.date.includes(searchLower)
      );
    }

    // Filtro por data
    if (filterOptions.dateFrom) {
      filtered = filtered.filter(tx => tx.date >= filterOptions.dateFrom);
    }
    if (filterOptions.dateTo) {
      filtered = filtered.filter(tx => tx.date <= filterOptions.dateTo);
    }

    // Filtro por categoria
    if (filterOptions.category) {
      filtered = filtered.filter(tx => tx.category === filterOptions.category);
    }

    // Filtro por tipo de transação
    if (filterOptions.transactionType !== 'all') {
      if (filterOptions.transactionType === 'income') {
        filtered = filtered.filter(tx => tx.value > 0);
      } else if (filterOptions.transactionType === 'expense') {
        filtered = filtered.filter(tx => tx.value < 0);
      }
    }

    // Filtro por valor
    if (filterOptions.valueMin) {
      const minValue = parseFloat(filterOptions.valueMin);
      filtered = filtered.filter(tx => Math.abs(tx.value) >= minValue);
    }
    if (filterOptions.valueMax) {
      const maxValue = parseFloat(filterOptions.valueMax);
      filtered = filtered.filter(tx => Math.abs(tx.value) <= maxValue);
    }

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filterOptions.sortBy) {
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
        default:
          return 0;
      }

      if (filterOptions.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      searchTerm: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      transactionType: 'all' as const,
      valueMin: '',
      valueMax: '',
      sortBy: 'date' as const,
      sortOrder: 'desc' as const
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== '' && value !== 'all' && value !== 'date' && value !== 'desc'
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Icon 
              icon="mdi:magnify" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
            />
            <input
              type="text"
              placeholder="Buscar transações..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Icon icon="mdi:filter-variant" className="w-4 h-4" />
            <span>Filtros</span>
            <Icon 
              icon={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"} 
              className="w-4 h-4" 
            />
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center space-x-1 px-3 py-2 text-red-600 hover:text-red-700 text-sm"
            >
              <Icon icon="mdi:close" className="w-4 h-4" />
              <span>Limpar</span>
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              id="date-from"
              label="Data de início"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilter('dateFrom', e.target.value)}
              variant="default"
            />

            <Input
              id="date-to"
              label="Data de fim"
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilter('dateTo', e.target.value)}
              variant="default"
            />

            <Select
              label="Categoria"
              placeholder="Todas as categorias"
              value={filters.category}
              onChange={(value) => updateFilter('category', value)}
              options={[
                { label: 'Todas as categorias', value: '' },
                ...categories.map(category => ({ label: category, value: category }))
              ]}
            />

            <Select
              label="Tipo"
              value={filters.transactionType}
              onChange={(value) => updateFilter('transactionType', value)}
              options={[
                { label: 'Todos', value: 'all' },
                { label: 'Receitas', value: 'income' },
                { label: 'Gastos', value: 'expense' }
              ]}
            />

            <Input
              id="value-min"
              label="Valor mínimo"
              type="currency"
              placeholder="0.00"
              value={filters.valueMin}
              onChange={(e) => updateFilter('valueMin', e.target.value)}
              variant="default"
            />

            <Input
              id="value-max"
              label="Valor máximo"
              type="currency"
              placeholder="0.00"
              value={filters.valueMax}
              onChange={(e) => updateFilter('valueMax', e.target.value)}
              variant="default"
            />
          </div>
        </div>
      )}

      {hasActiveFilters && (
        <div className="px-4 py-2 bg-blue-50 border-t border-gray-200">
          <div className="flex items-center space-x-2 text-sm text-blue-700">
            <Icon icon="mdi:information" className="w-4 h-4" />
            <span>
              Filtros ativos: {Object.entries(filters).filter(([key, value]) => 
                value !== '' && value !== 'all' && value !== 'date' && value !== 'desc'
              ).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
