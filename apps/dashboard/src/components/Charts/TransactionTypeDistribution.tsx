'use client';

import React, { useMemo } from 'react';
import { Transaction } from '@/hooks/useTransaction';

interface TransactionTypeDistributionProps {
  transactions: Transaction[];
}

export const TransactionTypeDistribution: React.FC<TransactionTypeDistributionProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const typeGroups = transactions.reduce((acc, tx) => {
      const category = tx.value >= 0 ? 'Receitas' : 'Gastos';
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Math.abs(tx.value);
      return acc;
    }, {} as Record<string, number>);

    const total = Object.values(typeGroups).reduce((sum, value) => sum + value, 0);
    
    return Object.entries(typeGroups).map(([type, value]) => ({
      type,
      value,
      percentage: total > 0 ? (value / total) * 100 : 0,
      color: type === 'Receitas' ? '#10B981' : '#EF4444'
    }));
  }, [transactions]);

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribuição por Tipo</h3>
      
      {chartData.length > 0 ? (
        <div className="flex flex-col items-center">
          {/* Donut Chart */}
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#F3F4F6"
                strokeWidth="12"
              />
              {chartData.map((item, index) => {
                const circumference = 2 * Math.PI * 40;
                const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
                const previousPercentage = chartData.slice(0, index).reduce((sum, prev) => sum + prev.percentage, 0);
                const strokeDashoffset = -((previousPercentage / 100) * circumference);
                
                return (
                  <circle
                    key={item.type}
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={item.color}
                    strokeWidth="12"
                    strokeDasharray={strokeDasharray}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-xs text-gray-500">Total</div>
                <div className="text-sm font-semibold">
                  R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 w-full">
            {chartData.map((item) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-gray-700">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    R$ {item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 py-8">
          Nenhuma transação encontrada
        </div>
      )}
    </div>
  );
};

export default TransactionTypeDistribution;
