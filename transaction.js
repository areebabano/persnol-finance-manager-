import { v4 as uuid } from "uuid";
import { format } from "date-fns";
import { RecurrenceInterval, } from "./types.js";
import { addExpense } from "./expense.js";
import { addIncome } from "./income.js";
import { addBill } from "./bill.js";
// make an array to store recurring transaction
const reccuringTransactions = [];
// add transaction into array
export const addRecurringTransaction = async (id, type, nextDate, amount, category, frequency) => {
    const userId = uuid();
    reccuringTransactions.push({
        id,
        type,
        nextDate,
        amount,
        category,
        frequency,
    });
};
// Process recurring transactions
export const processRecurringTransactions = async () => {
    // console.log("Processing recurring transactions...");
    console.log("Processed recurring transactions at", format(new Date(), "yyyy-MM-dd HH:mm:ss"));
    let today = new Date();
    reccuringTransactions.forEach((transaction) => {
        if (transaction.nextDate <= today) {
            switch (transaction.type) {
                case "expense":
                    addExpense(uuid(), transaction.category, today, transaction.amount);
                    break;
                case "income":
                    addIncome(uuid(), transaction.category, today, transaction.amount);
                    break;
                case "bill":
                    addBill(uuid(), transaction.category, transaction.amount, today);
                    break;
                default:
                    console.log("Invalid type!");
                    break;
            }
            switch (transaction.frequency) {
                case RecurrenceInterval.DAILY:
                    transaction.nextDate.setDate(transaction.nextDate.getDate() + 1);
                    break;
                case RecurrenceInterval.WEEKLY:
                    transaction.nextDate.setDate(transaction.nextDate.getDate() + 1);
                    break;
                case RecurrenceInterval.MONTHLY:
                    transaction.nextDate.setDate(transaction.nextDate.getMonth() + 1);
                default:
                    console.log("Invalid frequency!");
                    break;
            }
        }
    });
};
