import { v4 as uuid } from "uuid";
// make array to store incomes
export let incomes = [];
// add income into array
export const addIncome = async (id, source, date, amount) => {
    // incomes.push({source,date,amount})
    const newIncome = { id: uuid(), source, date, amount };
    incomes.push(newIncome);
    return newIncome;
};
// get income
export const getIncome = async () => {
    return incomes;
};
// update budget
export const updateIncome = (id, source, date, amount) => {
    const incomeIndex = incomes.findIndex((income) => income.id === id);
    if (incomeIndex !== -1) {
        incomes[incomeIndex] = { id, source, date, amount };
        return incomes[incomeIndex];
    }
    return null;
};
// delete budget
export const deleteIncome = (id) => {
    const initialLength = incomes.length;
    incomes = incomes.filter((income) => income.id !== id);
    return incomes.length < initialLength;
};
