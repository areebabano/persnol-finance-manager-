import { ExpenseType, Categories } from "./types.js";
import { v4 as uuid } from "uuid";

// make array to store expenses

export let expenses: ExpenseType[] = [];

// add expenses into array

export const addExpense = async (
  id: string,
  category: Categories,
  date: Date,
  amount: number
): Promise<ExpenseType> => {
  const newExpense: ExpenseType = { id: uuid(), category, date, amount };
  expenses.push(newExpense);
  return newExpense;
};

// get expenses

export const getExpense = async (): Promise<ExpenseType[]> => {
  return expenses;
};

// update expense

export const updateExpense = (
  id: string,
  category: Categories,
  date: Date,
  amount: number
): ExpenseType | null => {
  const expenseIndex = expenses.findIndex((expense) => expense.id === id);
  if (expenseIndex !== -1) {
    expenses[expenseIndex] = { id, category, date, amount };
    return expenses[expenseIndex];
  }
  return null;
};

// delete expense

export const deleteExpense = (id: string): boolean => {
  const initialLength = expenses.length;
  expenses = expenses.filter((expense) => expense.id !== id);
  return expenses.length < initialLength;
};
