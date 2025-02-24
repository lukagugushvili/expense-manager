import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { Expense } from './schema/expense.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesResPayload } from './expenses-res-payload/expenses-res-payload';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private readonly expenseModule: Model<Expense>,
    private readonly userService: UsersService,
  ) {}

  // Create expense and add it in mongoDb
  async createExpense(createExpenseDto: CreateExpenseDto): Promise<Expense> {
    try {
      const user = await this.userService.findUserById(createExpenseDto.user);
      if (!user) throw new NotFoundException('User not found');

      const expense = await this.expenseModule.create(createExpenseDto);

      await this.userService.addExpenseToUser(user.id, expense.id);

      return expense.populate('user');
    } catch (error) {
      console.error(`Error creating expense: ${error.message}`);
      throw new BadRequestException(
        `Could not create expense: ${error.message}`,
      );
    }
  }

  // Get expenses array from mongoDB dataBase
  async findAllExpenses(): Promise<Expense[]> {
    const expenses = await this.expenseModule.find().exec();

    if (!expenses || expenses.length === 0) {
      throw new NotFoundException('Expenses array is empty');
    }

    return expenses;
  }

  // Get expense with mongo ID
  async findExpenseById(id: string): Promise<Expense> {
    const expense = await this.expenseModule.findById(id).exec();

    if (!expense) {
      throw new NotFoundException(`Expense with ID ${id} not found`);
    }

    return expense;
  }

  // Update a expense information
  async updateExpense(
    id: string,
    updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    try {
      const expense = await this.expenseModule
        .findByIdAndUpdate(id, updateExpenseDto, { new: true })
        .exec();

      if (!expense) {
        throw new NotFoundException(`Expense with ID ${id} not found`);
      }

      return expense;
    } catch (error) {
      console.error(`Error updating expense: ${error.message}`);
      throw new BadRequestException(
        `Could not update expense: ${error.message}`,
      );
    }
  }

  // Delete expense from mongoDB
  async removeExpense(id: string): Promise<ExpensesResPayload> {
    try {
      const expense = await this.expenseModule.findByIdAndDelete(id).exec();

      if (!expense) {
        throw new NotFoundException(`Expense with ID ${id} not found`);
      }

      return {
        message: 'Expense deleted successfully',
        expenses: expense,
      };
    } catch (error) {
      console.error(`Error deleting expense: ${error.message}`);
      throw new BadRequestException(
        `Could not delete expense: ${error.message}`,
      );
    }
  }
}
