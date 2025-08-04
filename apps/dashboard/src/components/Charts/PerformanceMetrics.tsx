/**
 * Métricas de Performance Financeira - Requisito Tech Challenge
 * Dashboard com KPIs e análises avançadas
 */

'use client';

import React, { useMemo } from 'react';
import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/slices/transactionSlice';
import moment from 'moment';

interface PerformanceMetricsProps {
  transactions: Transaction[];
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ transactions }) => {
  const metrics = useMemo(() => {
    const now = moment();
    const currentMonth = now.format('YYYY-MM');
    const lastMonth = now.subtract(1, 'month').format('YYYY-MM');
    
    // Transações do mês atual
    const currentMonthTx = transactions.filter(tx => tx.date.startsWith(currentMonth));
    const lastMonthTx = transactions.filter(tx => tx.date.startsWith(lastMonth));
    
    // Receitas e Gastos
    const currentIncome = currentMonthTx.filter(tx => tx.value > 0).reduce((sum, tx) => sum + tx.value, 0);
    const currentExpenses = currentMonthTx.filter(tx => tx.value < 0).reduce((sum, tx) => sum + Math.abs(tx.value), 0);
    const lastIncome = lastMonthTx.filter(tx => tx.value > 0).reduce((sum, tx) => sum + tx.value, 0);
    const lastExpenses = lastMonthTx.filter(tx => tx.value < 0).reduce((sum, tx) => sum + Math.abs(tx.value), 0);
    
    // Cálculos
    const netIncome = currentIncome - currentExpenses;
    const lastNetIncome = lastIncome - lastExpenses;
    const savingsRate = currentIncome > 0 ? ((currentIncome - currentExpenses) / currentIncome) * 100 : 0;
    const expenseRatio = currentIncome > 0 ? (currentExpenses / currentIncome) * 100 : 0;
    
    // Variações percentuais
    const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
    const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
    const netIncomeChange = lastNetIncome !== 0 ? ((netIncome - lastNetIncome) / Math.abs(lastNetIncome)) * 100 : 0;
    
    // Média diária
    const daysInMonth = now.daysInMonth();
    const dailyIncome = currentIncome / daysInMonth;
    const dailyExpenses = currentExpenses / daysInMonth;
    
    // Transações por categoria (top 3)
    const categoryExpenses = currentMonthTx
      .filter(tx => tx.value < 0)
      .reduce((acc, tx) => {
        const category = tx.category || 'Outros';
        acc[category] = (acc[category] || 0) + Math.abs(tx.value);
        return acc;
      }, {} as Record<string, number>);
    
    const topCategories = Object.entries(categoryExpenses)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3);

    return {
      currentIncome,
      currentExpenses,
      netIncome,
      savingsRate,
      expenseRatio,
      incomeChange,
      expenseChange,
      netIncomeChange,
      dailyIncome,
      dailyExpenses,
      topCategories,
      transactionCount: currentMonthTx.length
    };
  }, [transactions]);

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600';
    if (change < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'mdi:trending-up';
    if (change < 0) return 'mdi:trending-down';
    return 'mdi:trending-neutral';
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon, 
    color = 'blue',
    format = 'currency' 
  }: {
    title: string;
    value: number;
    change?: number;
    icon: string;
    color?: string;
    format?: 'currency' | 'percentage' | 'number';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
        case 'percentage':
          return `${val.toFixed(1)}%`;
        case 'number':
          return val.toLocaleString('pt-BR');
        default:
          return val.toString();
      }
    };

    return (
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-10 h-10 rounded-full bg-${color}-100 flex items-center justify-center`}>
            <Icon icon={icon} className={`w-5 h-5 text-${color}-600`} />
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 ${getChangeColor(change)}`}>
              <Icon icon={getChangeIcon(change)} className="w-4 h-4" />
              <span className="text-xs font-medium">
                {Math.abs(change).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
        <div className="mb-1">
          <div className="text-2xl font-bold text-gray-800">
            {formatValue(value)}
          </div>
          <div className="text-sm text-gray-600">{title}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Título */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">
          📈 Performance Financeira
        </h3>
        <div className="text-sm text-gray-500">
          {moment().format('MMMM YYYY')}
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receitas do Mês"
          value={metrics.currentIncome}
          change={metrics.incomeChange}
          icon="mdi:cash-plus"
          color="green"
        />
        <MetricCard
          title="Gastos do Mês"
          value={metrics.currentExpenses}
          change={metrics.expenseChange}
          icon="mdi:cash-minus"
          color="red"
        />
        <MetricCard
          title="Saldo Líquido"
          value={metrics.netIncome}
          change={metrics.netIncomeChange}
          icon="mdi:scale-balance"
          color="blue"
        />
        <MetricCard
          title="Taxa de Poupança"
          value={metrics.savingsRate}
          icon="mdi:piggy-bank"
          color="purple"
          format="percentage"
        />
      </div>

      {/* Métricas Secundárias */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Receita Diária Média"
          value={metrics.dailyIncome}
          icon="mdi:calendar-today"
          color="green"
        />
        <MetricCard
          title="Gasto Diário Médio"
          value={metrics.dailyExpenses}
          icon="mdi:calendar-clock"
          color="orange"
        />
        <MetricCard
          title="Razão de Gastos"
          value={metrics.expenseRatio}
          icon="mdi:percent"
          color="yellow"
          format="percentage"
        />
        <MetricCard
          title="Total de Transações"
          value={metrics.transactionCount}
          icon="mdi:swap-horizontal"
          color="indigo"
          format="number"
        />
      </div>

      {/* Top Categorias */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          🏆 Top Categorias de Gastos
        </h4>
        {metrics.topCategories.length > 0 ? (
          <div className="space-y-3">
            {metrics.topCategories.map(([category, amount], index) => {
              const percentage = metrics.currentExpenses > 0 ? (amount / metrics.currentExpenses) * 100 : 0;
              const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500'];
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${colors[index]}`} />
                    <span className="font-medium text-gray-700">
                      #{index + 1} {category}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-800">
                      R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}% do total
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-4">
            Nenhum gasto por categoria encontrado
          </div>
        )}
      </div>

      {/* Alertas e Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Icon icon="mdi:lightbulb" className="w-5 h-5 mr-2 text-yellow-500" />
          Insights Financeiros
        </h4>
        <div className="space-y-2 text-sm">
          {metrics.savingsRate > 20 && (
            <div className="flex items-center space-x-2 text-green-700">
              <Icon icon="mdi:check-circle" className="w-4 h-4" />
              <span>Excelente! Sua taxa de poupança está acima de 20%</span>
            </div>
          )}
          {metrics.expenseRatio > 80 && (
            <div className="flex items-center space-x-2 text-red-700">
              <Icon icon="mdi:alert-circle" className="w-4 h-4" />
              <span>Atenção: Seus gastos representam mais de 80% da renda</span>
            </div>
          )}
          {metrics.incomeChange > 10 && (
            <div className="flex items-center space-x-2 text-blue-700">
              <Icon icon="mdi:trending-up" className="w-4 h-4" />
              <span>Ótimo! Sua renda aumentou {metrics.incomeChange.toFixed(1)}% este mês</span>
            </div>
          )}
          {metrics.expenseChange < -10 && (
            <div className="flex items-center space-x-2 text-green-700">
              <Icon icon="mdi:trending-down" className="w-4 h-4" />
              <span>Parabéns! Você reduziu seus gastos em {Math.abs(metrics.expenseChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
