import { SavingGoalType } from "./types.js";
import { v4 as uuid } from "uuid";

// make an array to store saving goals

export let savingGoals: SavingGoalType[] = [];

// add saving goals into array

export const addSavingGoals = async (
  id: string,
  goals: string,
  amount: number
): Promise<SavingGoalType> => {
  const newGoals: SavingGoalType = { id: uuid(), goals, amount };
  savingGoals.push(newGoals);
  return newGoals;
};

// get saving goals

export const getSavingGoals = async (): Promise<SavingGoalType[]> => {
  return savingGoals;
};

// update budget

export const updateSavingGoals = (
  id: string,
  goals: string,
  amount: number
): SavingGoalType | null => {
  const savingIndex = savingGoals.findIndex((saving) => saving.id === id);
  if (savingIndex !== -1) {
    savingGoals[savingIndex] = { id, goals, amount };
    return savingGoals[savingIndex];
  }
  return null;
};

// delete budget

export const deleteSavingGoals = (id: string): boolean => {
  const initialLength = savingGoals.length;
  savingGoals = savingGoals.filter((saving) => saving.id !== id);
  return savingGoals.length < initialLength;
};
