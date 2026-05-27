// Maps frontend string category IDs to backend database category IDs
// These must match the seeded data in backend/src/main/resources/data.sql

export const categoryToDbId: Record<string, number> = {
  // Expense categories
  food: 1,
  transport: 2,
  housing: 3,
  entertainment: 4,
  health: 5,
  education: 6,
  shopping: 7,
  other: 8,
  // Income categories
  salary: 9,
  freelance: 10,
  investment: 11,
  bonus: 12,
  gift: 13,
  savings: 14,
  refund: 15,
  // 'other' for income maps to 16
};

// Income-specific 'other' override
export const incomeCategoryToDbId: Record<string, number> = {
  ...categoryToDbId,
  other: 16,
};

// Reverse map: DB ID → frontend string ID
export const dbIdToCategory: Record<number, string> = {
  1: 'food',
  2: 'transport',
  3: 'housing',
  4: 'entertainment',
  5: 'health',
  6: 'education',
  7: 'shopping',
  8: 'other',
  9: 'salary',
  10: 'freelance',
  11: 'investment',
  12: 'bonus',
  13: 'gift',
  14: 'savings',
  15: 'refund',
  16: 'other',
};
