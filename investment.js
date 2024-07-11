import { v4 as uuid } from "uuid";
// make array to store investments
export let investments = [];
// add investment into array
export const addInvestment = async (id, name, date, amount) => {
    const newInvestment = { id: uuid(), name, date, amount };
    investments.push(newInvestment);
    return newInvestment;
};
// get investment
export const getInvestment = async () => {
    return investments;
};
// update budget
export const updateInvestment = (id, name, date, amount) => {
    const investmentIndex = investments.findIndex((investment) => investment.id === id);
    if (investmentIndex !== -1) {
        investments[investmentIndex] = { id, name, date, amount };
        return investments[investmentIndex];
    }
    return null;
};
// delete budget
export const deleteInvestment = (id) => {
    const initialLength = investments.length;
    investments = investments.filter((investment) => investment.id !== id);
    return investments.length < initialLength;
};
