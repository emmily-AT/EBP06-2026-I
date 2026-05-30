import api from './client';

export const transactionService = {
  getTransactions() {
    return api.get('/transactions');
  },

  createIncome(data: { amount: number; description?: string; categoryId?: number; date?: string }) {
    return api.post('/transactions', data);
  },

  createExpense(data: { amount: number; description?: string; categoryId?: number; date?: string }) {
    return api.post('/transactions/expense', data);
  },

  getBalance() {
    return api.get('/transactions/balance');
  },
};
