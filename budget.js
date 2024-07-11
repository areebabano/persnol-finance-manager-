import { v4 as uuid } from "uuid";
// make array to store budget
export let budgets = [];
// add budget into array
export const addBudget = async (id, category, limit) => {
    const newBudget = { id: uuid(), category, limit };
    budgets.push(newBudget);
    return newBudget;
};
// get budget
export const getBudget = async () => {
    return budgets;
};
// update budget
export const updateBudget = (id, category, limit) => {
    const budgetIndex = budgets.findIndex((budget) => budget.id === id);
    if (budgetIndex !== -1) {
        budgets[budgetIndex] = { id, category, limit };
        return budgets[budgetIndex];
    }
    return null;
};
// delete budget
export const deleteBudget = (id) => {
    const initialLength = budgets.length;
    budgets = budgets.filter((budget) => budget.id !== id);
    return budgets.length < initialLength;
};
