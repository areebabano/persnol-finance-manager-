import { AccountType } from "./types.js";
import { v4 as uuid } from "uuid";

// make an array to store accounts

export let accounts: AccountType[] = [];

// // add account

export const addAccount = async (
  id: string,
  name: string,
  type: string,
  balance: number
): Promise<AccountType> => {
  const newAccount: AccountType = { id: uuid(), name, type, balance };
  accounts.push(newAccount);
  return newAccount;
};

// get account

export const getAccount = async () => {
  return accounts;
};

// update account
export const updateAccount = (
  id: string,
  name: string,
  type: string,
  balance: number
): AccountType | null => {
  const accountIndex = accounts.findIndex((account) => account.id === id);
  if (accountIndex !== -1) {
    accounts[accountIndex] = { id, name, type, balance };
    return accounts[accountIndex];
  }
  return null;
};

// delete account

export const deleteAccount = (id: string): boolean => {
  const initialLength = accounts.length;
  accounts = accounts.filter((account) => account.id !== id);
  return accounts.length < initialLength;
};
