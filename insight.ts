import { expenses } from "./expense.js";
import { incomes } from "./income.js";

export const getFinancialInsights = async (): Promise<string[]> => {
  const insights: string[] = [];
  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  );
  const totalIncome = incomes.reduce((acc, income) => acc + income.amount, 0);

  insights.push(`Total Expenses: ${totalExpenses}`);
  insights.push(`Total Income: ${totalIncome}`);

  if (totalExpenses > totalExpenses) {
    console.log("You are spending more than you earn...");
  } else {
    console.log("You are saving money...");
  }

  return insights;
};
