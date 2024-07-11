import inquirer from "inquirer";
import chalk from "chalk";
import { User, userAuthentication, users } from "./user.js";
import { addExpense, getExpense, updateExpense, deleteExpense, } from "./expense.js";
import { addBudget, getBudget, updateBudget, deleteBudget, } from "./budget.js";
import { addIncome, deleteIncome, getIncome, updateIncome, } from "./income.js";
import { addSavingGoals, getSavingGoals, deleteSavingGoals, updateSavingGoals, } from "./savinggoal.js";
import { addInvestment, getInvestment, updateInvestment, deleteInvestment, } from "./investment.js";
import { addBill, getBill, updateBill, deleteBill } from "./bill.js";
import { getCreditScore } from "./creditscore.js";
import { getFinancialInsights } from "./insight.js";
import { addAccount, getAccount, updateAccount, deleteAccount, } from "./account.js";
import { twoFactorAuthentication, encryptData } from "./security.js";
import { Categories } from "./types.js";
import { addRecurringTransaction, processRecurringTransactions, } from "./transaction.js";
import scheduleTransactions from "./schedule.js";
import { v4 as uuid } from "uuid";
// handle (Add,Update,Delete,view) budget
const handleAddBudget = async () => {
    try {
        const categories = Object.values(Categories);
        const budgetCategory = await inquirer.prompt([
            {
                name: "category",
                type: "list",
                message: chalk.magentaBright("Select a Category"),
                choices: categories,
            },
        ]);
        const budgetLimit = await inquirer.prompt([
            {
                name: "limit",
                type: "input",
                message: chalk.cyanBright("Enter the Budget Limit"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const budgetId = uuid();
        const budget = addBudget(budgetId, budgetCategory.category, parseFloat(budgetLimit.limit));
        console.log(chalk.blueBright(`\nBudget Added Successfully!
  You've set a budget of Rs.${chalk.bold(budgetLimit.limit)} for ${chalk.bold(budgetCategory.category)}.\n`));
    }
    catch (error) {
        console.error(chalk.red("Error! Add Budget ", error));
    }
};
const handleUpdateBudget = async () => {
    try {
        const budgets = await getBudget();
        const budgetChoices = budgets.map((budget) => ({
            name: `${budget.category} - Rs.${budget.limit}`,
            value: budget.id,
        }));
        const { budgetId } = await inquirer.prompt([
            {
                name: "budgetId",
                type: "list",
                message: chalk.yellowBright("Select a budget to update:"),
                choices: budgetChoices,
            },
        ]);
        const updatedBudget = await inquirer.prompt([
            {
                name: "category",
                type: "list",
                message: chalk.magentaBright("Select a new category:"),
                choices: Object.values(Categories),
            },
            {
                name: "limit",
                type: "input",
                message: chalk.cyanBright("Enter the new budget limit:"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const budget = updateBudget(budgetId, updatedBudget.category, parseFloat(updatedBudget.limit));
        if (budget) {
            console.log(chalk.green(`\nBudget updated successfully! You've set a budget of Rs.${budget.limit} for ${budget.category}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update budget."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Update Budget ", error));
    }
};
const handleDeleteBudget = async () => {
    try {
        const budgets = await getBudget();
        const budgetChoices = budgets.map((budget) => ({
            name: `${budget.category} - Rs.${budget.limit}`,
            value: budget.id,
        }));
        const { budgetId } = await inquirer.prompt([
            {
                name: "budgetId",
                type: "list",
                message: chalk.cyanBright("Select a budget to delete:"),
                choices: budgetChoices,
            },
        ]);
        const success = deleteBudget(budgetId);
        if (success) {
            console.log(chalk.yellow("\nBudget deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete budget."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Delete Budget ", error));
    }
};
const handleViewBudgets = async () => {
    const budgets = await getBudget();
    console.log(chalk.magenta("Current Budgets:"));
    budgets.forEach((budget) => {
        console.log(chalk.cyan(`- ${budget.category}: Rs.${budget.limit},`));
    });
};
// handle (Add,Update,Delete,view) expenses
const handleAddExpense = async () => {
    try {
        const categoriesExp = Object.values(Categories);
        const expenseCategory = await inquirer.prompt([
            {
                name: "category",
                type: "list",
                message: chalk.magentaBright("Select a Category"),
                choices: categoriesExp,
            },
        ]);
        const expenseDate = await inquirer.prompt([
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date (YYYY:MM:DD)"),
            },
        ]);
        const expenseAmount = await inquirer.prompt([
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const expenseId = uuid();
        await addExpense(expenseId, expenseCategory.category, new Date(expenseDate.date), expenseAmount.amount);
        console.log(chalk.blueBright(`\nExpense Added Successfully!
      You've set a expense of Rs.${chalk.bold(parseFloat(expenseAmount.amount))} for ${chalk.bold(expenseCategory.category)}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error! Added Expense ", error));
    }
};
const handleUpdateExpense = async () => {
    try {
        const expenses = await getExpense();
        const expenseChoices = expenses.map((expense) => ({
            name: `${expense.category} - Rs.${expense.amount}`,
            value: expense.id,
        }));
        const expenseId = await inquirer.prompt([
            {
                name: "expenseId",
                type: "list",
                message: chalk.cyanBright("Select a budget to update:"),
                choices: expenseChoices,
            },
        ]);
        const categoriesExp = Object.values(Categories);
        const updatedExpense = await inquirer.prompt([
            {
                name: "category",
                type: "list",
                message: chalk.magentaBright("Select a Category"),
                choices: categoriesExp,
            },
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date (YYYY:MM:DD)"),
            },
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const expense = updateExpense(expenseId, updatedExpense.category, updatedExpense.date, parseFloat(updatedExpense.amount));
        if (expense) {
            console.log(chalk.green(`\nExpense  successfully updated!
        You've set a expense of Rs.${chalk.bold(parseFloat(updatedExpense.amount))} for ${chalk.bold(updatedExpense.category)}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update expense."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Update Expense ", error));
    }
};
const handleDeleteExpense = async () => {
    try {
        const expenses = await getExpense();
        const expenseChoices = expenses.map((expense) => ({
            name: `${expense.category}- ${expense.date} - Rs.${expense.amount}`,
            value: expense.id,
        }));
        const { expenseId } = await inquirer.prompt([
            {
                name: "expenseId",
                type: "list",
                message: chalk.magentaBright("Select a budget to delete:"),
                choices: expenseChoices,
            },
        ]);
        const success = deleteExpense(expenseId);
        if (success) {
            console.log(chalk.yellow("\nExpense deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete expense."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Delete Expense ", error));
    }
};
const handleViewExpenses = async () => {
    const expenses = await getExpense();
    console.log(chalk.magenta("Current Expense:"));
    expenses.forEach((expense) => {
        console.log(chalk.cyan(`- ${expense.category} - ${expense.date}: Rs.${expense.amount}`));
    });
};
// handle (Add,Update,Delete,view) income
const handleAddIncome = async () => {
    try {
        const incomeSource = await inquirer.prompt([
            {
                name: "source",
                type: "input",
                message: chalk.magentaBright("Enter the Income Source"),
            },
        ]);
        const incomeDate = await inquirer.prompt([
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date (YYYY:MM:DD)"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
        ]);
        const incomeAmount = await inquirer.prompt([
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const incomeId = uuid();
        await addIncome(incomeId, incomeSource.source, new Date(incomeDate.date), parseFloat(incomeAmount.amount));
        console.log(chalk.blueBright(`\nIncome tracked and recorded successfully from '${incomeSource.source}' on ${chalk.bold(incomeDate.date)}. Amount: Rs.${chalk.bold(parseFloat(incomeAmount.amount))}.\n`));
    }
    catch (error) {
        console.error(chalk.red("Error! Added Income ", error));
    }
};
const handleUpdateIncome = async () => {
    try {
        const incomes = await getIncome();
        const incomeChoices = incomes.map((income) => ({
            name: `${income.source} - Rs.${income.amount} - ${income.date}`,
            value: income.id,
        }));
        const { incomeId } = await inquirer.prompt([
            {
                name: "incomeId",
                type: "list",
                message: chalk.magentaBright("Select a income to update:"),
                choices: incomeChoices,
            },
        ]);
        const updatedIncome = await inquirer.prompt([
            {
                name: "source",
                type: "input",
                message: chalk.magentaBright("Enter the Income Source"),
            },
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date (YYYY:MM:DD)"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const income = updateIncome(incomeId, updatedIncome.source, updatedIncome.date, parseFloat(updatedIncome.amount));
        if (income) {
            console.log(chalk.green(`\nIncome tracked successfully updated! and recorded successfully from '${updatedIncome.source}' on ${chalk.bold(updatedIncome.date)}. Amount: Rs.${chalk.bold(parseFloat(updatedIncome.amount))}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update income."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! update Income ", error));
    }
};
const handleDeleteIncome = async () => {
    try {
        const incomes = await getIncome();
        const incomeChoices = incomes.map((income) => ({
            name: `${income.source}- ${income.date} - Rs.${income.amount}`,
            value: income.id,
        }));
        const { incomeId } = await inquirer.prompt([
            {
                name: "incomeId",
                type: "list",
                message: chalk.magentaBright("Select a income to delete:"),
                choices: incomeChoices,
            },
        ]);
        const success = deleteIncome(incomeId);
        if (success) {
            console.log(chalk.yellow("\nIncome deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete income."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Delete Income ", error));
    }
};
const handleViewIncome = async () => {
    const incomes = await getIncome();
    console.log(chalk.magenta("Current Income:"));
    incomes.forEach((income) => {
        console.log(chalk.cyan(`- ${income.source} - ${income.date}: Rs.${income.amount}`));
    });
};
// handle (Add,Update,Delete,view) saving goals
const handleAddSavings = async () => {
    try {
        const savingGoals = await inquirer.prompt([
            {
                name: "goal",
                type: "input",
                message: chalk.magentaBright("Enter the Saving Goals"),
            },
        ]);
        const savingAmount = await inquirer.prompt([
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount needed"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const savingId = uuid();
        await addSavingGoals(savingId, savingGoals.goal, parseFloat(savingAmount.amount));
        console.log(chalk.blueBright(`\nSavings goal '${savingGoals.goal}' successfully! added with a target amount of Rs.${chalk.bold(parseFloat(savingAmount.amount))}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error! Add Saving Goals ", error));
    }
};
const handleUpdateSavings = async () => {
    try {
        const savingGoals = await getSavingGoals();
        const savingChoices = savingGoals.map((savingGoal) => ({
            name: `${savingGoal.goals} - Rs.${savingGoal.amount}`,
            value: savingGoal.id,
        }));
        const { savingId } = await inquirer.prompt([
            {
                name: "savingId",
                type: "list",
                message: chalk.magentaBright("Select a saving goal to update:"),
                choices: savingChoices,
            },
        ]);
        const updatedSavingGoal = await inquirer.prompt([
            {
                name: "goal",
                type: "input",
                message: chalk.magentaBright("Enter the saving goal"),
            },
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const saving = updateSavingGoals(savingId, updatedSavingGoal.goal, parseFloat(updatedSavingGoal.amount));
        if (saving) {
            console.log(chalk.green(`\nSavings goal '${updatedSavingGoal.goal}' successfully updated! with a target amount of Rs.${chalk.bold(parseFloat(updatedSavingGoal.amount))}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update saving goal."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Update Saving Goals ", error));
    }
};
const handleDeleteSavings = async () => {
    try {
        const savingGoals = await getSavingGoals();
        const savingChoices = savingGoals.map((savingGoal) => ({
            name: `${savingGoal.goals} - Rs.${savingGoal.amount}`,
            value: savingGoal.id,
        }));
        const { savingId } = await inquirer.prompt([
            {
                name: "savingId",
                type: "list",
                message: chalk.magentaBright("Select a income to delete:"),
                choices: savingChoices,
            },
        ]);
        const success = deleteSavingGoals(savingId);
        if (success) {
            console.log(chalk.yellow("\nSaving Goals deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete saving goals."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Delete Saving Goals ", error));
    }
};
const handleViewSavings = async () => {
    const savingGoals = await getSavingGoals();
    console.log(chalk.magenta("Current Savings:"));
    savingGoals.forEach((saving) => {
        console.log(chalk.cyan(`- ${saving.goals} : Rs.${saving.amount}`));
    });
};
// handle (Add,Update,Delete,view) investments
const handleAddInvestment = async () => {
    try {
        const investmentName = await inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: chalk.magentaBright("Enter the Investment Name"),
            },
        ]);
        const investmentDate = await inquirer.prompt([
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
        ]);
        const investmentAmount = await inquirer.prompt([
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const investmentId = uuid();
        await addInvestment(investmentId, investmentName.name, new Date(investmentDate.date), parseFloat(investmentAmount.amount));
        console.log(chalk.blueBright(`\nInvestment '${investmentName.name}' successfully recorded on ${chalk.bold(investmentDate.date)} with an amount of Rs.${chalk.bold(parseFloat(investmentAmount.amount))}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error! Add Investment", error));
    }
};
const handleUpdateInvestment = async () => {
    try {
        const investments = await getInvestment();
        const investmentChoices = investments.map((investment) => ({
            name: `${investment.name} - Rs.${investment.amount}`,
            value: investment.id,
        }));
        const { investmentId } = await inquirer.prompt([
            {
                name: "investmentId",
                type: "list",
                message: chalk.magentaBright("Select a investment to update:"),
                choices: investmentChoices,
            },
        ]);
        const updatedInvestment = await inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: chalk.magentaBright("Enter the name"),
            },
            {
                name: "date",
                type: "input",
                message: chalk.cyanBright("Enter the Date"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const investment = updateInvestment(investmentId, updatedInvestment.name, updatedInvestment.date, parseFloat(updatedInvestment.amount));
        if (investment) {
            console.log(chalk.green(`\nInvestment '${updateInvestment.name}' successfully updated! recorded on ${chalk.bold(updatedInvestment.date)} with an amount of Rs.${chalk.bold(parseFloat(updatedInvestment.amount))}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update saving goal."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Update Investment ", error));
    }
};
const handleDeleteInvestment = async () => {
    try {
        const investments = await getInvestment();
        const investmentChoices = investments.map((investment) => ({
            name: `${investment.name} - Rs.${investment.amount}`,
            value: investment.id,
        }));
        const { investmentId } = await inquirer.prompt([
            {
                name: "investmentId",
                type: "list",
                message: chalk.magentaBright("Select a investment to delete:"),
                choices: investmentChoices,
            },
        ]);
        const success = deleteInvestment(investmentId);
        if (success) {
            console.log(chalk.yellow("Investments deleted successfully."));
        }
        else {
            console.log(chalk.red("Failed to delete investments."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error delete Investment ", error));
    }
};
const handleViewInvestment = async () => {
    const investments = await getInvestment();
    console.log(chalk.magenta("\nCurrent Investments:\n"));
    investments.forEach((investment) => {
        console.log(chalk.cyan(`- ${investment.name} : Rs.${investment.amount}`));
    });
};
// handle (Add,Update,Delete,view) bills
const handleAddBill = async () => {
    try {
        const billName = await inquirer.prompt([
            {
                name: "bill",
                type: "input",
                message: chalk.magentaBright("Enter the Bill Name"),
            },
        ]);
        const billDueDate = await inquirer.prompt([
            {
                name: "dueDate",
                type: "input",
                message: chalk.cyanBright("Enter the Due Date(YYYY:MM:DD)"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
        ]);
        const billAmount = await inquirer.prompt([
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const billId = uuid();
        await addBill(billId, billName.bill, billAmount.amount, new Date(billDueDate.dueDate));
        console.log(chalk.blueBright(`\nBill reminder '${billName.bill}' successfully added! Rs${billAmount.amount} with a due date of ${chalk.bold(billDueDate.dueDate)}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error! Added Bill Reminders ", error));
    }
};
const handleUpdateBill = async () => {
    try {
        const bills = await getBill();
        const billChoices = bills.map((bill) => ({
            name: `${bill.name} - Rs.${bill.amount}`,
            value: bill.id,
        }));
        const { billId } = await inquirer.prompt([
            {
                name: "billId",
                type: "list",
                message: chalk.magentaBright("Select a bill to update:"),
                choices: billChoices,
            },
        ]);
        const updatedBill = await inquirer.prompt([
            {
                name: "name",
                type: "input",
                message: chalk.magentaBright("Enter the bill name"),
            },
            {
                name: "dueDate",
                type: "input",
                message: chalk.cyanBright("Enter the DueDate"),
                validate: (value) => {
                    const isValidDate = !isNaN(Date.parse(value));
                    return isValidDate || "Please enter a valid date (YYYY-MM-DD)";
                },
            },
            {
                name: "amount",
                type: "input",
                message: chalk.greenBright("Enter the Amount"),
                validate: (value) => {
                    const valid = !isNaN(parseFloat(value));
                    return valid || "Please enter a valid number";
                },
            },
        ]);
        const bill = updateBill(billId, updateBill.name, parseFloat(updatedBill.amount), updatedBill.dueDate);
        if (bill) {
            console.log(chalk.green(`\nBill reminder'${updatedBill.name}' successfully updated! recorded on ${chalk.bold(updatedBill.dueDate)} with an amount of Rs.${chalk.bold(parseFloat(updatedBill.amount))}.\n`));
        }
        else {
            console.log(chalk.red("Failed to update bill reminder."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error Update Bill Reminders ", error));
    }
};
const handleDeleteBill = async () => {
    try {
        const bills = await getBill();
        const billChoices = bills.map((bill) => ({
            name: `${bill.name} - Rs.${bill.amount}`,
            value: bill.id,
        }));
        const { billId } = await inquirer.prompt([
            {
                name: "billId",
                type: "list",
                message: chalk.magentaBright("Select a bill to delete:"),
                choices: billChoices,
            },
        ]);
        const success = deleteBill(billId);
        if (success) {
            console.log(chalk.yellow("\nBill reminders deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete bill reminders."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error Delete Bill Reminders ", error));
    }
};
const handleViewBill = async () => {
    const bills = await getBill();
    console.log(chalk.magenta("Current Bill Reminders:"));
    bills.forEach((bill) => {
        console.log(chalk.cyan(`- ${bill.name} : Rs.${bill.amount}`));
    });
};
// handle  credit score
const handleCredit = async () => {
    try {
        const creditScore = await getCreditScore();
        console.log(chalk.magenta(`\nCredit score retrieved successfully: ${creditScore}\n`));
    }
    catch (error) {
        console.log(chalk.red("Error!", error));
    }
};
// handle financial insights
const handleInsights = async () => {
    try {
        const insights = await getFinancialInsights();
        console.log(chalk.blueBright(`\nFinancial insights retrieved successfully: ${insights}\n`));
    }
    catch (error) {
        console.log(chalk.red("Error!", error));
    }
};
const handleAddAccount = async () => {
    try {
        const accountDetails = await inquirer.prompt([
            { name: "name", type: "input", message: "Enter account name:" },
            {
                name: "type",
                type: "input",
                message: chalk.magentaBright("Enter account type (savings/checking/credit):"),
            },
            {
                name: "balance",
                type: "input",
                message: chalk.greenBright("Enter initial balance:"),
                validate: (value) => !isNaN(parseFloat(value)) || "Please enter a valid number",
            },
        ]);
        const accountId = uuid();
        await addAccount(accountId, accountDetails.name, accountDetails.type, parseFloat(accountDetails.balance));
        console.log(chalk.blueBright(`\nAccount '${accountDetails.name}' successfully added with an initial balance of Rs.${chalk.bold(parseFloat(accountDetails.balance))}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error! Added Account ", error));
    }
};
const handleUpdateAccount = async () => {
    try {
        const accounts = await getAccount();
        const accountChoices = accounts.map((account) => ({
            name: `${account.name} - Rs.${account.balance}`,
            value: account.id,
        }));
        const { accountId } = await inquirer.prompt([
            {
                name: "accountId",
                type: "list",
                message: chalk.magentaBright("Select an account to update:"),
                choices: accountChoices,
            },
        ]);
        const updatedDetails = await inquirer.prompt([
            { name: "name", type: "input", message: "Enter new account name:" },
            {
                name: "type",
                type: "input",
                message: chalk.magentaBright("Enter new account type (savings/checking/credit):"),
            },
            {
                name: "balance",
                type: "input",
                message: chalk.greenBright("Enter new balance:"),
                validate: (value) => !isNaN(parseFloat(value)) || "Please enter a valid number",
            },
        ]);
        updateAccount(accountId, updatedDetails.name, updatedDetails.type, parseFloat(updatedDetails.balance));
        console.log(chalk.green(`\nAccount '${updatedDetails.name}' successfully updated! with an initial balance of Rs.${chalk.bold(parseFloat(updatedDetails.balance))}.\n`));
    }
    catch (error) {
        console.log(chalk.red("Error Update Account ", error));
    }
};
const handleDeleteAccount = async () => {
    try {
        const accounts = await getAccount();
        const accountChoices = accounts.map((account) => ({
            name: `${account.name} (${account.type})`,
            value: account.id,
        }));
        const accountId = await inquirer.prompt([
            {
                name: "accountId",
                type: "list",
                message: chalk.magentaBright("Select an account to delete:"),
                choices: accountChoices,
            },
        ]);
        const success = deleteAccount(accountId);
        if (success) {
            console.log(chalk.yellow("\nAccount deleted successfully.\n"));
        }
        else {
            console.log(chalk.red("Failed to delete account."));
        }
    }
    catch (error) {
        console.log(chalk.red("Error! Delete Account ", error));
    }
};
const handleViewAccount = async () => {
    const accounts = await getAccount();
    console.log(chalk.magenta("Current Accounts:"));
    accounts.forEach((account) => {
        console.log(chalk.cyan(`- ${account.name} : Rs.${account.balance}`));
    });
};
const handleSecurity = async () => {
    try {
        const option = await inquirer.prompt([
            {
                name: "select",
                type: "list",
                message: chalk.blueBright("Select Security Option"),
                choices: [
                    chalk.cyanBright("TWO-FACTOR AUTHENTICATION"),
                    chalk.green("ENCRYPT SENSITIVE DATA"),
                ],
            },
        ]);
        switch (option.select) {
            case chalk.cyanBright("TWO-FACTOR AUTHENTICATION"):
                await twoFactorAuthentication();
                break;
            case chalk.green("ENCRYPT SENSITIVE DATA"):
                console.log(chalk.yellow("\nEncrypting sensitive data...\n"));
                const answer = await inquirer.prompt([
                    {
                        name: "userName",
                        type: "input",
                        message: chalk.magentaBright("Enter your username:"),
                    },
                    {
                        name: "password",
                        type: "password",
                        mask: "*",
                        message: chalk.cyanBright("Enter your password:"),
                    },
                    {
                        name: "email",
                        type: "input",
                        message: chalk.greenBright("Enter your email:"),
                    },
                ]);
                const encryptedPassword = await encryptData(answer.password);
                const newUser = new User(answer.userName, encryptedPassword, answer.email);
                await newUser.setPassword(answer.password);
                users.push(newUser);
                console.log(chalk.green("\nSensitive data encrypted successfully!\n"));
                break;
            default:
                console.log(chalk.red("Invalid option"));
                break;
        }
    }
    catch (error) {
        console.log(chalk.red("Error! setting up security ", error));
    }
};
const handleAddRecurringTransaction = async () => {
    try {
        const categories = Object.values(Categories);
        const transactionDetails = await inquirer.prompt([
            {
                name: "type",
                type: "list",
                message: chalk.greenBright("Select Transaction Type"),
                choices: [
                    chalk.magenta("expense"),
                    chalk.blueBright("income"),
                    chalk.cyanBright("bill"),
                ],
            },
            {
                name: "category",
                type: "list",
                message: chalk.magentaBright("Select the Category"),
                choices: categories,
            },
            {
                name: "amount",
                type: "number",
                message: chalk.greenBright("Enter the Amount"),
            },
            {
                name: "frequency",
                type: "list",
                message: chalk.greenBright("Select the frequency"),
                choices: [
                    chalk.magentaBright("daily"),
                    chalk.blueBright("weekly"),
                    chalk.cyanBright("monthly"),
                ],
            },
            {
                name: "nextDate",
                type: "input",
                message: chalk.yellow("Enter the NextDate(YYYY:MM:DD)"),
            },
        ]);
        const newTransactions = {
            id: uuid(),
            type: transactionDetails.type,
            category: transactionDetails.category,
            amount: parseFloat(transactionDetails.amount),
            frequency: transactionDetails.frequency,
            nextDate: new Date(transactionDetails.nextDate),
        };
        await addRecurringTransaction(newTransactions.id, newTransactions.type, newTransactions.nextDate, newTransactions.amount, newTransactions.category, newTransactions.frequency);
        console.log(chalk.blue("\nProcessing recurring transactions...\n"));
        console.log(chalk.green(`\nRecurring transaction added successfully for category ${newTransactions.category} with amount Rs.${newTransactions.amount}.\n`));
        // Schedule the recurring transaction
        await processRecurringTransactions();
        scheduleTransactions();
    }
    catch (error) {
        console.error(chalk.red("Error! Adding Recurring Transaction ", error));
    }
};
const handleView = async () => {
    try {
        console.log(chalk.blueBright("Accounts: "));
        await handleViewAccount();
        console.log(chalk.blueBright("Budgets: "));
        await handleViewBudgets();
        console.log(chalk.blueBright("Expenses: "));
        await handleViewExpenses();
        console.log(chalk.blueBright("Income: "));
        await handleViewIncome();
        console.log(chalk.blueBright("Savings Goals: "));
        await handleViewSavings();
        console.log(chalk.blueBright("Investments: "));
        await handleViewInvestment();
        console.log(chalk.blueBright("Bill Reminders: "));
        await handleViewBill();
    }
    catch (error) {
        console.log(chalk.red("Error!", error));
    }
};
const handleExit = async () => {
    console.log(chalk.red("Exiting! Application successfully..."));
    process.exit();
};
let condition = true;
const main = async () => {
    do {
        try {
            const select = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.greenBright("Select an option"),
                    choices: [
                        chalk.magenta("ACCOUNTS"),
                        chalk.cyan("BUDGETS"),
                        chalk.green("EXPENSES"),
                        chalk.blue("INCOMES"),
                        chalk.gray("SAVING GOALS"),
                        chalk.yellow("INVESTMENTS"),
                        chalk.magenta("BILLS"),
                        chalk.cyan("TRACK CREDIT SCORE"),
                        chalk.green("FINANCIAL INSIGHTS"),
                        chalk.blue("ADD RECURRING TRANSACTIONS"),
                        chalk.gray("VIEW FINANCIAL STATUS"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (select.option) {
                case chalk.magenta("ACCOUNTS"):
                    await mainFunc1();
                    break;
                case chalk.cyan("BUDGETS"):
                    await mainFunc2();
                    break;
                case chalk.green("EXPENSES"):
                    await mainFunc3();
                    break;
                case chalk.blue("INCOMES"):
                    await mainFunc4();
                    break;
                case chalk.gray("SAVING GOALS"):
                    await mainFunc5();
                    break;
                case chalk.yellow("INVESTMENTS"):
                    await mainFunc6();
                    break;
                case chalk.magenta("BILLS"):
                    await mainFunc7();
                    break;
                case chalk.cyan("TRACK CREDIT SCORE"):
                    await handleCredit();
                    break;
                case chalk.green("FINANCIAL INSIGHTS"):
                    await handleInsights();
                    break;
                case chalk.blue("ADD RECURRING TRANSACTIONS"):
                    await handleAddRecurringTransaction();
                    break;
                case chalk.gray("VIEW FINANCIAL STATUS"):
                    await handleView();
                    break;
                case chalk.red("EXIT"):
                    await handleExit();
                    break;
                default:
                    console.log(chalk.red("Invalid option"));
                    break;
            }
        }
        catch (error) {
            console.error(chalk.red("Error! in main function ", error));
        }
    } while (condition);
};
(async () => {
    try {
        console.log(chalk.magenta("\n*******************______________________________________________*********************\n"));
        console.log(chalk.yellow("------------___________| SIGN-UP PERSNOL FINANCE MANAGER |___________----------"));
        console.log(chalk.magenta("\n*******************______________________________________________*********************\n"));
        const answer = await inquirer.prompt([
            {
                name: "userName",
                type: "input",
                message: chalk.magentaBright("Enter your username:"),
            },
            {
                name: "password",
                type: "password",
                mask: "*",
                message: chalk.cyanBright("Enter your password:"),
            },
            {
                name: "email",
                type: "input",
                message: chalk.yellow("Enter your email"),
            },
        ]);
        const isAuthenticate = await userAuthentication(answer.userName, answer.password, answer.email);
        if (!isAuthenticate) {
            console.log(chalk.green("\nUser Authenticated Successfully!...\n"));
            console.log(chalk.magenta("*****************--------------------------------------------*******************"));
            console.log(chalk.yellow("\n>>>>>>>>>>>>__________| WELCOME! TO PERSNOL FINANCE MANGER |_________<<<<<<<<<<<<\n"));
            console.log(chalk.magenta("\n*****************---------------------------------------------*******************\n"));
            await main();
        }
        else {
            console.log(chalk.red("Failed to authenticate user."));
        }
    }
    catch (error) {
        console.error(chalk.red("Error during user authentication:", error));
    }
})();
const mainFunc1 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.magentaBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD ACCOUNT"),
                        chalk.green("UPDATE ACCOUNT"),
                        chalk.yellow("DELETE ACCOUNT"),
                        chalk.cyan("SET-UP SECURITY"),
                        chalk.magenta("VIEW ACCOUNT"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD ACCOUNT"):
                    await handleAddAccount();
                    break;
                case chalk.green("UPDATE ACCOUNT"):
                    await handleUpdateAccount();
                    break;
                case chalk.yellow("DELETE ACCOUNT"):
                    await handleDeleteAccount();
                    break;
                case chalk.cyan("SET-UP SECURITY"):
                    await handleSecurity();
                    break;
                case chalk.magenta("VIEW ACCOUNT"):
                    await handleViewAccount();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred", error));
        }
    }
};
const mainFunc2 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.blueBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD BUDGET"),
                        chalk.green("UPDATE BUDGET"),
                        chalk.yellow("DELETE BUDGET"),
                        chalk.magenta("VIEW BUDGET"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD BUDGET"):
                    await handleAddBudget();
                    break;
                case chalk.green("UPDATE BUDGET"):
                    await handleUpdateBudget();
                    break;
                case chalk.yellow("DELETE BUDGET"):
                    await handleDeleteBudget();
                    break;
                case chalk.magenta("VIEW BUDGET"):
                    await handleViewBudgets();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error("An error occurred:", error);
        }
    }
};
const mainFunc3 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.yellow("Select an option"),
                    choices: [
                        chalk.blueBright("ADD EXPENSE"),
                        chalk.green("UPDATE EXPENSE"),
                        chalk.yellow("DELETE EXPENSE"),
                        chalk.magenta("VIEW EXPENSE"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD EXPENSE"):
                    await handleAddExpense();
                    break;
                case chalk.green("UPDATE EXPENSE"):
                    await handleUpdateExpense();
                    break;
                case chalk.yellow("DELETE EXPENSE"):
                    await handleDeleteExpense();
                    break;
                case chalk.magenta("VIEW EXPENSE"):
                    await handleViewExpenses();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred:", error));
        }
    }
};
const mainFunc4 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.cyanBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD INCOME"),
                        chalk.green("UPDATE INCOME"),
                        chalk.yellow("DELETE INCOME"),
                        chalk.magenta("VIEW INCOME"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD INCOME"):
                    await handleAddIncome();
                    break;
                case chalk.green("UPDATE INCOME"):
                    await handleUpdateIncome();
                    break;
                case chalk.yellow("DELETE INCOME"):
                    await handleDeleteIncome();
                    break;
                case chalk.magenta("VIEW INCOME"):
                    await handleViewIncome();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred:", error));
        }
    }
};
const mainFunc5 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.greenBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD SAVING GOALS"),
                        chalk.green("UPDATE SAVING GOALS"),
                        chalk.yellow("DELETE SAVING GOALS"),
                        chalk.magenta("VIEW SAVING GOALS"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD SAVING GOALS"):
                    await handleAddSavings();
                    break;
                case chalk.green("UPDATE SAVING GOALS"):
                    await handleUpdateSavings();
                    break;
                case chalk.yellow("DELETE SAVING GOALS"):
                    await handleDeleteSavings();
                    break;
                case chalk.magenta("VIEW SAVING GOALS"):
                    await handleViewSavings();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred:", error));
        }
    }
};
const mainFunc6 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.magentaBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD INVESTMENT"),
                        chalk.green("UPDATE INVESTMENT"),
                        chalk.yellow("DELETE INVESTMENT"),
                        chalk.magenta("VIEW INVESTMENT"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD INVESTMENT"):
                    await handleAddInvestment();
                    break;
                case chalk.green("UPDATE INVESTMENT"):
                    await handleUpdateInvestment();
                    break;
                case chalk.yellow("DELETE INVESTMENT"):
                    await handleDeleteInvestment();
                    break;
                case chalk.magenta("VIEW INVESTMENT"):
                    await handleViewInvestment();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred:", error));
        }
    }
};
const mainFunc7 = async () => {
    while (true) {
        try {
            const answer = await inquirer.prompt([
                {
                    name: "option",
                    type: "list",
                    message: chalk.blueBright("Select an option"),
                    choices: [
                        chalk.blueBright("ADD Bill REMINDERS"),
                        chalk.green("UPDATE Bill REMINDERS"),
                        chalk.yellow("DELETE Bill REMINDERS"),
                        chalk.magenta("VIEW Bill REMINDERS"),
                        chalk.red("EXIT"),
                    ],
                },
            ]);
            switch (answer.option) {
                case chalk.blueBright("ADD Bill REMINDERS"):
                    await handleAddBill();
                    break;
                case chalk.green("UPDATE Bill REMINDERS"):
                    await handleUpdateBill();
                    // await budgetId()
                    break;
                case chalk.yellow("DELETE Bill REMINDERS"):
                    await handleDeleteBill();
                    break;
                case chalk.magenta("VIEW Bill REMINDERS"):
                    await handleViewBill();
                    break;
                case chalk.red("EXIT"):
                    console.log(chalk.red("Exiting...."));
                    // process.exit();
                    await main();
            }
        }
        catch (error) {
            console.error(chalk.red("An error occurred:", error));
        }
    }
};
