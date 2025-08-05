/**
 * Widget de Metas Financeiras - Requisito Plus do Tech Challenge
 * Permite personalização do dashboard com metas de economia e alertas
 * Persistência no IndexedDB com funcionalidades CRUD
 */

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Icon } from '@iconify/react';
import type { Transaction } from '@/store/slices/transactionSlice';
import { financialGoalsService, type FinancialGoal, type CreateGoalData } from '@/services/financialGoalsService';

interface FinancialGoalsWidgetProps {
  transactions: Transaction[];
}

export const FinancialGoalsWidget: React.FC<FinancialGoalsWidgetProps> = ({ transactions }) => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<CreateGoalData>({
    title: '',
    targetAmount: 0,
    deadline: '',
    category: 'Poupança'
  });
  // const [editingGoal, setEditingGoal] = useState<string | null>(null);

  // Carregar metas do IndexedDB
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      await financialGoalsService.initializeDefaultGoals();
      const loadedGoals = await financialGoalsService.getAllGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await financialGoalsService.createGoal(newGoal);
      await loadGoals();
      setNewGoal({
        title: '',
        targetAmount: 0,
        deadline: '',
        category: 'Poupança'
      });
      setShowAddGoal(false);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      alert('Erro ao criar meta financeira');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) {
      return;
    }

    try {
      await financialGoalsService.deleteGoal(goalId);
      await loadGoals();
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      alert('Erro ao deletar meta financeira');
    }
  };

  // const handleEditGoal = async (goalId: string, updates: Partial<FinancialGoal>) => {
  //   try {
  //     await financialGoalsService.updateGoal(goalId, updates);
  //     await loadGoals();
  //     // setEditingGoal(null);
  //   } catch (error) {
  //     console.error('Erro ao editar meta:', error);
  //     alert('Erro ao editar meta financeira');
  //   }
  // };

  // Calcular progresso das metas baseado nas transações
  const goalsWithProgress = useMemo(() => {
    return goals.map(goal => {
      let currentAmount = 0;
      
      if (goal.category === 'Controle') {
        // Para metas de controle de gastos, calcular gastos do mês atual
        const currentMonth = new Date().toISOString().slice(0, 7);
        currentAmount = transactions
          .filter(tx => tx.date.startsWith(currentMonth) && tx.value < 0)
          .reduce((sum, tx) => sum + Math.abs(tx.value), 0);
      } else {
        // Para metas de poupança, simular progresso baseado em receitas
        const totalIncome = transactions
          .filter(tx => tx.value > 0)
          .reduce((sum, tx) => sum + tx.value, 0);
        currentAmount = Math.min(totalIncome * 0.1, goal.targetAmount); // 10% das receitas
      }

      const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);
      const isOverLimit = goal.category === 'Controle' && currentAmount > goal.targetAmount;
      
      return {
        ...goal,
        currentAmount,
        progress,
        isOverLimit,
        daysLeft: Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      };
    });
  }, [goals, transactions]);

  const getProgressColor = (goal: FinancialGoal & { progress: number; isOverLimit?: boolean; color?: string }) => {
    if (goal.isOverLimit) return '#EF4444';
    if (goal.progress >= 100) return '#10B981';
    if (goal.progress >= 75) return '#F59E0B';
    return goal.color;
  };

  const getStatusMessage = (goal: FinancialGoal & { progress: number; isOverLimit?: boolean; daysLeft?: number }) => {
    if (goal.isOverLimit) return '⚠️ Limite ultrapassado!';
    if (goal.progress >= 100) return '🎉 Meta atingida!';
    if (goal.progress >= 75) return '🔥 Quase lá!';
    if (goal.daysLeft !== undefined && goal.daysLeft < 30) return '⏰ Prazo próximo';
    return '📈 Em progresso';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <Icon icon="mdi:loading" className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando metas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          🎯 Metas Financeiras
        </h3>
        <button
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
        >
          <Icon icon="mdi:plus" className="w-4 h-4" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goalsWithProgress.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Icon icon="mdi:target" className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-lg font-medium mb-1">Nenhuma meta cadastrada</p>
            <p className="text-sm">Clique em &quot;Nova Meta&quot; para começar a definir suas metas financeiras</p>
          </div>
        ) : (
          goalsWithProgress.map((goal) => (
          <div key={goal.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${goal.color}20` }}
                >
                  <Icon icon={goal.icon} className="w-5 h-5" style={{ color: goal.color }} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{goal.title}</h4>
                  <p className="text-sm text-gray-500">{goal.category}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-800">
                  R$ {goal.currentAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-gray-500">
                  de R$ {goal.targetAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">{goal.progress.toFixed(1)}%</span>
                <span className="text-xs text-gray-600">
                  {goal.daysLeft > 0 ? `${goal.daysLeft} dias restantes` : 'Prazo vencido'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(goal.progress, 100)}%`,
                    backgroundColor: getProgressColor(goal)
                  }}
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium" style={{ color: getProgressColor(goal) }}>
                {getStatusMessage(goal)}
              </span>
              <div className="flex space-x-2">
                {/* <button 
                  onClick={() => setEditingGoal(goal.id)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  title="Editar meta"
                >
                  <Icon icon="mdi:pencil" className="w-4 h-4" />
                </button> */}
                <button 
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                  title="Excluir meta"
                >
                  <Icon icon="mdi:delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          ))
        )}
      </div>

      {/* Formulário de Nova Meta */}
      {showAddGoal && (
        <div className="mt-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 className="font-semibold text-blue-800 mb-3">Nova Meta Financeira</h4>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome da meta"
              value={newGoal.title}
              onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="number"
              placeholder="Valor alvo"
              value={newGoal.targetAmount || ''}
              onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: Number(e.target.value) }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select 
              value={newGoal.category}
              onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Poupança">Poupança</option>
              <option value="Controle">Controle</option>
              <option value="Investimento">Investimento</option>
              <option value="Lazer">Lazer</option>
              <option value="Educação">Educação</option>
              <option value="Saúde">Saúde</option>
              <option value="Casa">Casa</option>
              <option value="Transporte">Transporte</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2 mt-3">
            <button
              onClick={() => {
                setShowAddGoal(false);
                setNewGoal({
                  title: '',
                  targetAmount: 0,
                  deadline: '',
                  category: 'Poupança'
                });
              }}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleCreateGoal}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>
      )}

      {/* Resumo */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-lg font-bold text-green-600">
              {goalsWithProgress.filter(g => g.progress >= 100).length}
            </div>
            <div className="text-xs text-green-700">Metas Atingidas</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="text-lg font-bold text-yellow-600">
              {goalsWithProgress.filter(g => g.progress >= 75 && g.progress < 100).length}
            </div>
            <div className="text-xs text-yellow-700">Quase Lá</div>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="text-lg font-bold text-red-600">
              {goalsWithProgress.filter(g => g.isOverLimit).length}
            </div>
            <div className="text-xs text-red-700">Alertas</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoalsWidget;
