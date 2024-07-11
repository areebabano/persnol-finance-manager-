import { IncomeType } from "./types.js";
import { v4 as uuid } from "uuid";

// make array to store incomes

export let incomes: IncomeType[] = [];

// add income into array

export const addIncome = async (
  id: string,
  source: string,
  date: Date,
  amount: number
): Promise<IncomeType> => {
  // incomes.push({source,date,amount})
  const newIncome: IncomeType = { id: uuid(), source, date, amount };
  incomes.push(newIncome);
  return newIncome;
};

// get income

export const getIncome = async (): Promise<IncomeType[]> => {
  return incomes;
};

// update budget

export const updateIncome = (
  id: string,
  source: string,
  date: Date,
  amount: number
): IncomeType | null => {
  const incomeIndex = incomes.findIndex((income) => income.id === id);
  if (incomeIndex !== -1) {
    incomes[incomeIndex] = { id, source, date, amount };
    return incomes[incomeIndex];
  }
  return null;
};

// delete budget

export const deleteIncome = (id: string): boolean => {
  const initialLength = incomes.length;
  incomes = incomes.filter((income) => income.id !== id);
  return incomes.length < initialLength;
};
