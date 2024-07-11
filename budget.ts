import { BudgetType, Categories } from "./types.js";
import { v4 as uuid } from "uuid";

// make array to store budget

export let budgets: BudgetType[] = [];

// add budget into array

export const addBudget = async (
  id: string,
  category: Categories,
  limit: number
): Promise<BudgetType> => {
  const newBudget: BudgetType = { id: uuid(), category, limit };
  budgets.push(newBudget);
  return newBudget;
};

// get budget

export const getBudget = async (): Promise<BudgetType[]> => {
  return budgets;
};

// update budget

export const updateBudget = (
  id: string,
  category: Categories,
  limit: number
): BudgetType | null => {
  const budgetIndex = budgets.findIndex((budget) => budget.id === id);
  if (budgetIndex !== -1) {
    budgets[budgetIndex] = { id, category, limit };
    return budgets[budgetIndex];
  }
  return null;
};

// delete budget

export const deleteBudget = (id: string): boolean => {
  const initialLength = budgets.length;
  budgets = budgets.filter((budget) => budget.id !== id);
  return budgets.length < initialLength;
};
