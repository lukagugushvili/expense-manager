import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRoles } from 'src/enums/user-roles';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  expenseId?: string;

  @IsEnum(UserRoles, {
    message: 'Do not try to drive me crazy. you are not Admin',
  })
  @IsOptional()
  role?: UserRoles;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
