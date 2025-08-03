'use client';

import React, { useMemo } from 'react';
import { Transaction } from '@/hooks/useTransaction';
import moment from 'moment';

interface CashFlowChartProps {
  transactions: Transaction[];
}

export const CashFlowChart: React.FC<CashFlowChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    // Get last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(moment().subtract(i, 'days').format('YYYY-MM-DD'));
    }

    // Calculate daily cash flow
    const dailyCashFlow = days.map(day => {
      const dayTransactions = transactions.filter(tx => 
        moment(tx.date).format('YYYY-MM-DD') === day
      );
      
      const income = dayTransactions
        .filter(tx => tx.value > 0)
        .reduce((sum, tx) => sum + tx.value, 0);
      
      const expenses = dayTransactions
        .filter(tx => tx.value < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.value), 0);
      
      const netFlow = income - expenses;
      
      return {
        day: moment(day).format('DD/MM'),
        dayName: moment(day).format('ddd'),
        income,
        expenses,
        netFlow
      };
    });

    return dailyCashFlow;
  }, [transactions]);

  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.income, d.expenses)),
    100 // Minimum scale
  );

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Fluxo de Caixa (7 dias)</h3>
      
      <div className="h-48 flex items-end justify-between space-x-1">
        {chartData.map((data, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="w-full relative" style={{ height: '120px' }}>
              {/* Income bar */}
              <div
                className="bg-gradient-to-t from-green-500 to-green-400 rounded-t absolute bottom-0 w-1/2 left-0 transition-all duration-500"
                style={{
                  height: maxValue > 0 ? `${(data.income / maxValue) * 100}%` : '0%'
                }}
                title={`Receitas: R$ ${data.income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              
              {/* Expenses bar */}
              <div
                className="bg-gradient-to-t from-red-500 to-red-400 rounded-t absolute bottom-0 w-1/2 right-0 transition-all duration-500"
                style={{
                  height: maxValue > 0 ? `${(data.expenses / maxValue) * 100}%` : '0%'
                }}
                title={`Gastos: R$ ${data.expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
            </div>
            
            <div className="mt-2 text-xs text-center">
              <div className="font-medium text-gray-700">{data.dayName}</div>
              <div className="text-gray-600">{data.day}</div>
              <div className={`font-semibold text-xs ${data.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {data.netFlow >= 0 ? '+' : ''}R$ {data.netFlow.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span>Receitas</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span>Gastos</span>
        </div>
      </div>

      {chartData.every(d => d.income === 0 && d.expenses === 0) && (
        <div className="text-center text-gray-500 py-8">
          Nenhuma movimentação nos últimos 7 dias
        </div>
      )}
    </div>
  );
};

export default CashFlowChart;
