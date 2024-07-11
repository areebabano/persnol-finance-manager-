import { BillType } from "./types.js";
import { v4 as uuid } from "uuid";

// make an array to store bill

export let bills: BillType[] = [];

// add bills into array

export const addBill = async (
  id: string,
  name: string,
  amount: number,
  dueDate: Date
): Promise<BillType> => {
  // bills.push({name,dueDate})
  const newBill: BillType = { id: uuid(), name, amount, dueDate };
  bills.push(newBill);
  return newBill;
};

// get bills

export const getBill = async (): Promise<BillType[]> => {
  return bills;
};

// update bill

export const updateBill = (
  id: string,
  name: string,
  amount: number,
  dueDate: Date
): BillType | null => {
  const billIndex = bills.findIndex((bill) => bill.id === id);
  if (billIndex !== -1) {
    bills[billIndex] = { id, name, amount, dueDate };
    return bills[billIndex];
  }
  return null;
};

// delete bill

export const deleteBill = (id: string): boolean => {
  const initialLength = bills.length;
  bills = bills.filter((bill) => bill.id !== id);
  return bills.length < initialLength;
};
