/**
 * Serviço para gerenciar metas financeiras no IndexedDB
 */

import { getDB } from '@/lib/db';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGoalData {
  title: string;
  targetAmount: number;
  deadline: string;
  category: string;
  color?: string;
  icon?: string;
}

class FinancialGoalsService {
  private storeName = 'financial-goals';

  private generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDefaultColor(category: string): string {
    const colors: Record<string, string> = {
      'Poupança': '#10B981',
      'Controle': '#EF4444',
      'Investimento': '#8B5CF6',
      'Lazer': '#3B82F6',
      'Educação': '#F59E0B',
      'Saúde': '#06B6D4',
      'Casa': '#84CC16',
      'Transporte': '#F97316',
    };
    return colors[category] || '#6B7280';
  }

  private getDefaultIcon(category: string): string {
    const icons: Record<string, string> = {
      'Poupança': 'mdi:piggy-bank',
      'Controle': 'mdi:credit-card-outline',
      'Investimento': 'mdi:trending-up',
      'Lazer': 'mdi:airplane',
      'Educação': 'mdi:school',
      'Saúde': 'mdi:heart',
      'Casa': 'mdi:home',
      'Transporte': 'mdi:car',
    };
    return icons[category] || 'mdi:target';
  }

  async getAllGoals(): Promise<FinancialGoal[]> {
    try {
      const db = await getDB();
      const goals = await db.getAll(this.storeName);
      return goals.sort((a: FinancialGoal, b: FinancialGoal) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      return [];
    }
  }

  async getGoalById(id: string): Promise<FinancialGoal | undefined> {
    try {
      const db = await getDB();
      return await db.get(this.storeName, id);
    } catch (error) {
      console.error('Erro ao buscar meta:', error);
      return undefined;
    }
  }

  async createGoal(data: CreateGoalData): Promise<FinancialGoal> {
    try {
      const db = await getDB();
      const now = new Date().toISOString();
      
      const goal: FinancialGoal = {
        id: this.generateId(),
        title: data.title,
        targetAmount: data.targetAmount,
        currentAmount: 0,
        deadline: data.deadline,
        category: data.category,
        color: data.color || this.getDefaultColor(data.category),
        icon: data.icon || this.getDefaultIcon(data.category),
        createdAt: now,
        updatedAt: now,
      };

      await db.add(this.storeName, goal);
      return goal;
    } catch (error) {
      console.error('Erro ao criar meta:', error);
      throw new Error('Falha ao criar meta financeira');
    }
  }

  async updateGoal(id: string, updates: Partial<Omit<FinancialGoal, 'id' | 'createdAt'>>): Promise<FinancialGoal> {
    try {
      const db = await getDB();
      const existingGoal = await db.get(this.storeName, id);
      
      if (!existingGoal) {
        throw new Error('Meta não encontrada');
      }

      const updatedGoal: FinancialGoal = {
        ...existingGoal,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await db.put(this.storeName, updatedGoal);
      return updatedGoal;
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
      throw new Error('Falha ao atualizar meta financeira');
    }
  }

  async deleteGoal(id: string): Promise<void> {
    try {
      const db = await getDB();
      await db.delete(this.storeName, id);
    } catch (error) {
      console.error('Erro ao deletar meta:', error);
      throw new Error('Falha ao deletar meta financeira');
    }
  }

  async getGoalsByCategory(category: string): Promise<FinancialGoal[]> {
    try {
      const db = await getDB();
      return await db.getAllFromIndex(this.storeName, 'category', category);
    } catch (error) {
      console.error('Erro ao buscar metas por categoria:', error);
      return [];
    }
  }

  async initializeDefaultGoals(): Promise<void> {
    try {
      const existingGoals = await this.getAllGoals();
      
      if (existingGoals.length === 0) {
        const defaultGoals: CreateGoalData[] = [
          {
            title: 'Reserva de Emergência',
            targetAmount: 10000,
            deadline: '2024-12-31',
            category: 'Poupança',
          },
          {
            title: 'Viagem de Férias',
            targetAmount: 5000,
            deadline: '2024-06-30',
            category: 'Lazer',
          },
          {
            title: 'Limite de Gastos Mensais',
            targetAmount: 3000,
            deadline: '2024-01-31',
            category: 'Controle',
          }
        ];

        for (const goalData of defaultGoals) {
          await this.createGoal(goalData);
        }
      }
    } catch (error) {
      console.error('Erro ao inicializar metas padrão:', error);
    }
  }
}

export const financialGoalsService = new FinancialGoalsService();
