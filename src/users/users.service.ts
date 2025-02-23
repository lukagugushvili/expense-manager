import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRoles } from 'src/enums/user-roles';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserRes } from './users-res-payloads/delete-user';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // Create user and add in mongoDB
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    try {
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser)
        throw new BadRequestException(
          `User with Email ${email} already exists`,
        );

      const newUser = await this.userModel.create({
        ...createUserDto,
        role: UserRoles.USER,
      });

      await newUser.save();

      return newUser;
    } catch (error) {
      console.error(`Error creating user: ${error.message}`);
      throw new BadRequestException(`Could not create user: ${error.message}`);
    }
  }

  // Get users array from mongoDB dataBase
  async findAllUser(): Promise<User[]> {
    const users = await this.userModel.find().exec();

    if (!users || users.length === 0) {
      throw new NotFoundException('Users array is empty');
    }

    return users;
  }

  // Get user with mongo ID
  async findUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  // Update a users information
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updateData: Partial<UpdateUserDto> = { ...updateUserDto };

      const user = await this.userModel.findById(id).exec();

      if (updateUserDto.role === 'admin' && user?.role !== 'admin') {
        throw new BadRequestException('You cannot change role to admin');
      }

      if (updateUserDto?.password) {
        const salt_rounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

        if (isNaN(salt_rounds)) {
          throw new BadRequestException(
            'Invalid salt rounds. Please enter a number greater than 10',
          );
        }

        updateData.password = await bcrypt.hash(
          updateUserDto.password,
          salt_rounds,
        );
      }

      const updateUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();

      if (!updateUser) {
        throw new BadRequestException('You have problem. change ID');
      }

      return updateUser;
    } catch (error) {
      console.error(`Error updating user: ${error.message}`);
      throw new BadRequestException(`Could not update user: ${error.message}`);
    }
  }

  // Delete user from mongoDB users list
  async removeUser(id: string): Promise<DeleteUserRes> {
    try {
      const deleteUser = await this.userModel.findByIdAndDelete(id).exec();

      if (!deleteUser) {
        throw new NotFoundException(`You have problem. change ID`);
      }

      return { message: 'User deleted successfully', User: deleteUser };
    } catch (error) {
      console.error(`Error deleting user: ${error.message}`);
      throw new BadRequestException(`Could not delete user: ${error.message}`);
    }
  }

  // Connect the expense to the user
  async addExpenseToUser(userId: string, expenseId: string): Promise<void> {
    try {
      const user = await this.userModel.findById(userId).exec();

      user?.expenses.push(new Types.ObjectId(expenseId));
      await user?.save();
    } catch (error) {
      console.error(`Error adding expense to user: ${error.message}`);
      throw new BadRequestException(
        `Could not add expense to user: ${error.message}`,
      );
    }
  }

  async findFieldsForAuth(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email })
      .select(['email', 'password', 'role'])
      .exec();
  }
}
