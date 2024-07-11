import { v4 as uuid } from "uuid";
// make an array to store saving goals
export let savingGoals = [];
// add saving goals into array
export const addSavingGoals = async (id, goals, amount) => {
    const newGoals = { id: uuid(), goals, amount };
    savingGoals.push(newGoals);
    return newGoals;
};
// get saving goals
export const getSavingGoals = async () => {
    return savingGoals;
};
// update budget
export const updateSavingGoals = (id, goals, amount) => {
    const savingIndex = savingGoals.findIndex((saving) => saving.id === id);
    if (savingIndex !== -1) {
        savingGoals[savingIndex] = { id, goals, amount };
        return savingGoals[savingIndex];
    }
    return null;
};
// delete budget
export const deleteSavingGoals = (id) => {
    const initialLength = savingGoals.length;
    savingGoals = savingGoals.filter((saving) => saving.id !== id);
    return savingGoals.length < initialLength;
};
