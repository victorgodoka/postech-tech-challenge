'use client';

import React, { useMemo } from 'react';
import type { Transaction } from '@/store/slices/transactionSlice';
import moment from 'moment';

interface MonthlySpendingTrendProps {
  transactions: Transaction[];
}

export const MonthlySpendingTrend: React.FC<MonthlySpendingTrendProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    // Get last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(moment().subtract(i, 'months').format('YYYY-MM'));
    }

    // Calculate spending per month (only negative values/expenses)
    const monthlySpending = months.map(month => {
      const monthTransactions = transactions.filter(tx => {
        const txMonth = moment(tx.date).format('YYYY-MM');
        const isExpense = tx.value < 0;
        return txMonth === month && isExpense;
      });
      
      const totalSpending = monthTransactions.reduce((sum, tx) => sum + Math.abs(tx.value), 0);
      
      return {
        month: moment(month).format('MMM YYYY'),
        spending: totalSpending
      };
    });

    return monthlySpending;
  }, [transactions]);

  const maxSpending = Math.max(...chartData.map(d => d.spending));

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Gastos Mensais</h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full bg-gray-200 rounded-t relative" style={{ height: '120px' }}>
              <div
                className="bg-gradient-to-t from-red-500 to-red-400 rounded-t transition-all duration-500 ease-out"
                style={{
                  height: maxSpending > 0 ? `${(data.spending / maxSpending) * 100}%` : '0%',
                  width: '100%',
                  position: 'absolute',
                  bottom: 0
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600 text-center">
              <div className="font-medium">{data.month}</div>
              <div className="text-green-600 font-semibold">
                R$ {data.spending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>
      {chartData.every(d => d.spending === 0) && (
        <div className="text-center text-gray-500 py-8">
          Nenhum gasto registrado nos últimos 6 meses
        </div>
      )}
    </div>
  );
};

export default MonthlySpendingTrend;
