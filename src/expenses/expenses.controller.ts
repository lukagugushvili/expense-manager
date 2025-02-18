import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './schema/expense.schema';
import mongoose from 'mongoose';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesResPayload } from './expenses-res-payload/expenses-res-payload';

@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Get()
  async findAllExpenses(): Promise<Expense[]> {
    return this.expensesService.findAllExpenses();
  }

  @Get(':id')
  async findExpenseById(@Param('id') id: string): Promise<Expense> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }
    return this.expensesService.findExpenseById(id);
  }

  @Put(':id')
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ): Promise<Expense> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }
    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  async removeExpense(@Param('id') id: string): Promise<ExpensesResPayload> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }
    return this.expensesService.removeExpense(id);
  }
}
