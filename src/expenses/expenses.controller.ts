import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { Expense } from './schema/expense.schema';
import mongoose from 'mongoose';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesResPayload } from './expenses-res-payload/expenses-res-payload';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRoles } from 'src/enums/user-roles';
import { ReqUser } from 'src/types/req-user';
import { CurrentUser } from 'src/decorators/current-user.decorator';

@UseGuards(AuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async createExpense(
    @Body() createExpenseDto: CreateExpenseDto,
  ): Promise<Expense> {
    return this.expensesService.createExpense(createExpenseDto);
  }

  @Get()
  @Roles(UserRoles.ADMIN)
  async findAllExpenses(): Promise<Expense[]> {
    return this.expensesService.findAllExpenses();
  }

  @Get(':id')
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async findExpenseById(
    @Param('id') id: string,
    @CurrentUser() user: ReqUser,
  ): Promise<Expense> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    const expense = await this.expensesService.findExpenseById(id);
    if (!expense) throw new NotFoundException('Expense not found');

    if (user.role !== UserRoles.ADMIN && expense.user.toString() !== user.sub) {
      throw new ForbiddenException('You can only access your own expenses');
    }

    return expense;
  }

  @Put(':id')
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async updateExpense(
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
    @CurrentUser() user: ReqUser,
  ): Promise<Expense> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    const expense = await this.expensesService.findExpenseById(id);
    if (!expense) throw new NotFoundException('Expense not found');

    if (user.role !== UserRoles.ADMIN && expense.user.toString() !== user.sub) {
      throw new ForbiddenException('You can only update your own expenses');
    }

    return this.expensesService.updateExpense(id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles(UserRoles.USER, UserRoles.ADMIN)
  async removeExpense(
    @Param('id') id: string,
    @CurrentUser() user: ReqUser,
  ): Promise<ExpensesResPayload> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid mongo ID');
    }

    const expense = await this.expensesService.findExpenseById(id);
    if (!expense) throw new NotFoundException('Expense not found');

    if (user.role !== UserRoles.ADMIN && expense.user.toString() !== user.sub) {
      throw new ForbiddenException('You can only remove your own expenses');
    }

    return this.expensesService.removeExpense(id);
  }
}
