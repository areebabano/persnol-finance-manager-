import { v4 as uuid } from "uuid";
// make array to store expenses
export let expenses = [];
// add expenses into array
export const addExpense = async (id, category, date, amount) => {
    const newExpense = { id: uuid(), category, date, amount };
    expenses.push(newExpense);
    return newExpense;
};
// get expenses
export const getExpense = async () => {
    return expenses;
};
// update expense
export const updateExpense = (id, category, date, amount) => {
    const expenseIndex = expenses.findIndex((expense) => expense.id === id);
    if (expenseIndex !== -1) {
        expenses[expenseIndex] = { id, category, date, amount };
        return expenses[expenseIndex];
    }
    return null;
};
// delete expense
export const deleteExpense = (id) => {
    const initialLength = expenses.length;
    expenses = expenses.filter((expense) => expense.id !== id);
    return expenses.length < initialLength;
};
