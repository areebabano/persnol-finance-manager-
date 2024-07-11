import { InvestmentType } from "./types.js";
import { v4 as uuid } from "uuid";

// make array to store investments

export let investments: InvestmentType[] = [];

// add investment into array

export const addInvestment = async (
  id: string,
  name: string,
  date: Date,
  amount: number
): Promise<InvestmentType> => {
  const newInvestment: InvestmentType = { id: uuid(), name, date, amount };
  investments.push(newInvestment);
  return newInvestment;
};

// get investment

export const getInvestment = async (): Promise<InvestmentType[]> => {
  return investments;
};

// update budget

export const updateInvestment = (
  id: string,
  name: string,
  date: Date,
  amount: number
): InvestmentType | null => {
  const investmentIndex = investments.findIndex(
    (investment) => investment.id === id
  );
  if (investmentIndex !== -1) {
    investments[investmentIndex] = { id, name, date, amount };
    return investments[investmentIndex];
  }
  return null;
};

// delete budget

export const deleteInvestment = (id: string): boolean => {
  const initialLength = investments.length;
  investments = investments.filter((investment) => investment.id !== id);
  return investments.length < initialLength;
};
