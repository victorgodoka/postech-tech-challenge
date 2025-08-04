/**
 * Gráfico de Análise por Categorias - Requisito Tech Challenge
 * Mostra distribuição detalhada de gastos por categoria
 */

'use client';

import React, { useMemo } from 'react';
import type { Transaction } from '@/store/slices/transactionSlice';

interface CategoryAnalysisChartProps {
  transactions: Transaction[];
}

export const CategoryAnalysisChart: React.FC<CategoryAnalysisChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    // Agrupar por categoria (apenas gastos)
    const categoryGroups = transactions
      .filter(tx => tx.value < 0) // Apenas gastos
      .reduce((acc, tx) => {
        const category = tx.category || 'Outros';
        if (!acc[category]) {
          acc[category] = {
            total: 0,
            count: 0,
            transactions: []
          };
        }
        acc[category].total += Math.abs(tx.value);
        acc[category].count += 1;
        acc[category].transactions.push(tx);
        return acc;
      }, {} as Record<string, { total: number; count: number; transactions: Transaction[] }>);

    const total = Object.values(categoryGroups).reduce((sum, cat) => sum + cat.total, 0);
    
    return Object.entries(categoryGroups)
      .map(([category, data]) => ({
        category,
        total: data.total,
        count: data.count,
        percentage: total > 0 ? (data.total / total) * 100 : 0,
        avgTransaction: data.total / data.count
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8); // Top 8 categorias
  }, [transactions]);

  const maxValue = Math.max(...chartData.map(d => d.total), 100);

  const getCategoryColor = (index: number) => {
    const colors = [
      '#EF4444', '#F97316', '#F59E0B', '#EAB308',
      '#84CC16', '#22C55E', '#10B981', '#14B8A6'
    ];
    return colors[index % colors.length];
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'Alimentação': '🍽️',
      'Transporte': '🚗',
      'Saúde': '🏥',
      'Educação': '📚',
      'Lazer': '🎮',
      'Compras': '🛍️',
      'Casa': '🏠',
      'Outros': '📋'
    };
    return icons[category] || '💰';
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          📊 Análise por Categorias
        </h3>
        <div className="text-sm text-gray-500">
          Top {chartData.length} categorias
        </div>
      </div>
      
      {chartData.length > 0 ? (
        <div className="space-y-4">
          {chartData.map((data, index) => (
            <div key={data.category} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getCategoryIcon(data.category)}</span>
                  <div>
                    <div className="font-medium text-gray-800">{data.category}</div>
                    <div className="text-xs text-gray-500">
                      {data.count} transação{data.count !== 1 ? 'ões' : ''}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">
                    R$ {data.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {data.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              {/* Barra de progresso */}
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="h-3 rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                  style={{
                    width: `${(data.total / maxValue) * 100}%`,
                    backgroundColor: getCategoryColor(index)
                  }}
                />
              </div>
              
              {/* Informações adicionais */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>
                  Média por transação: R$ {data.avgTransaction.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
                <span>
                  {((data.total / maxValue) * 100).toFixed(1)}% do máximo
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <div className="text-4xl mb-2">📊</div>
          <div>Nenhum gasto por categoria encontrado</div>
        </div>
      )}

      {/* Resumo */}
      {chartData.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-red-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-red-600">
                R$ {chartData.reduce((sum, cat) => sum + cat.total, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-red-700">Total em Gastos</div>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {chartData.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-sm text-blue-700">Total de Transações</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryAnalysisChart;
