import api from './client';

export const budgetService = {
  getBudgets() {
    return api.get('/budgets');
  },

  createBudget(data: { name: string; limitAmount: number; month: number; year: number; categoryId?: number }) {
    return api.post('/budgets', data);
  },
};
