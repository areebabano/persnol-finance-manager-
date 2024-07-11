// create category type

export enum Categories {
  ENTERTAINMENT = "Entertainment",
  TRANSPORTATION = "Transportation",
  FOOD = "Food",
  UTILITIES = "Utilities",
  MISCELLANEOUS = "Miscellaneous",
}

// create recurrenceInterval type

export enum RecurrenceInterval {
  DAILY = "daily",
  WEEKLY = "weekly",
  MONTHLY = "monthly",
}
// create user type

export interface UserType {
  userName: string;
  password: string;
  email: string;
}

// create expense type

export interface ExpenseType {
  id: string;
  category: Categories;
  date: Date;
  amount: number;
}

// create budget type

export interface BudgetType {
  id: string;
  category: Categories;
  limit: number;
}

// create income type

export interface IncomeType {
  id: string;
  source: string;
  date: Date;
  amount: number;
}

// create savingGoals type

export interface SavingGoalType {
  id: string;
  goals: string;
  amount: number;
}

// create investment type

export interface InvestmentType {
  id: string;
  name: string;
  date: Date;
  amount: number;
}

// create bill type

export interface BillType {
  id: string;
  name: string;
  amount: number;
  dueDate: Date;
}

// create account type

export interface AccountType {
  id: string;
  name: string;
  type: string; // e.g., 'savings', 'checking', 'credit'
  balance: number;
}

export type RecurringTransactionType = {
  id: string;
  type: "expense" | "income" | "bill";
  nextDate: Date;
  amount: number;
  category: Categories;
  frequency: RecurrenceInterval; // daily , weekly , monthly
};
