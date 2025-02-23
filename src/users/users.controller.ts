import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  BadGatewayException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserRes } from './users-res-payloads/delete-user';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  async findAllUser(): Promise<User[]> {
    return this.usersService.findAllUser();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('Invalid mongo ID');
    }

    return this.usersService.findUserById(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('Invalid mongo ID');
    }

    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string): Promise<DeleteUserRes> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadGatewayException('Invalid mongo ID');
    }

    return this.usersService.removeUser(id);
  }
}
