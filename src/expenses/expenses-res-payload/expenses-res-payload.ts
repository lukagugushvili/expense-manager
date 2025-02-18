import { Expense } from '../schema/expense.schema';

export class ExpensesResPayload {
  message: string;
  expenses: Expense;
}
