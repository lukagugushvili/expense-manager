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
    message: 'Role must be either USER or ADMIN',
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
