import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Expense } from './schema/expense.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModule: Model<Expense>,
  ) {}
}
