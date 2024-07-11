import { v4 as uuid } from "uuid";
// make an array to store accounts
export let accounts = [];
// // add account
export const addAccount = async (id, name, type, balance) => {
    const newAccount = { id: uuid(), name, type, balance };
    accounts.push(newAccount);
    return newAccount;
};
// get account
export const getAccount = async () => {
    return accounts;
};
// update account
export const updateAccount = (id, name, type, balance) => {
    const accountIndex = accounts.findIndex((account) => account.id === id);
    if (accountIndex !== -1) {
        accounts[accountIndex] = { id, name, type, balance };
        return accounts[accountIndex];
    }
    return null;
};
// delete account
export const deleteAccount = (id) => {
    const initialLength = accounts.length;
    accounts = accounts.filter((account) => account.id !== id);
    return accounts.length < initialLength;
};
