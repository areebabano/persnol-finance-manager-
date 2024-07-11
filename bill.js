import { v4 as uuid } from "uuid";
// make an array to store bill
export let bills = [];
// add bills into array
export const addBill = async (id, name, amount, dueDate) => {
    // bills.push({name,dueDate})
    const newBill = { id: uuid(), name, amount, dueDate };
    bills.push(newBill);
    return newBill;
};
// get bills
export const getBill = async () => {
    return bills;
};
// update bill
export const updateBill = (id, name, amount, dueDate) => {
    const billIndex = bills.findIndex((bill) => bill.id === id);
    if (billIndex !== -1) {
        bills[billIndex] = { id, name, amount, dueDate };
        return bills[billIndex];
    }
    return null;
};
// delete bill
export const deleteBill = (id) => {
    const initialLength = bills.length;
    bills = bills.filter((bill) => bill.id !== id);
    return bills.length < initialLength;
};
