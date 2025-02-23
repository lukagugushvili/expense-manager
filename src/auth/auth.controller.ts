import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegisterRes } from './auth-responses/register-res';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './auth-responses/login-res';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: CreateUserDto): Promise<RegisterRes> {
    return this.authService.register(registerUserDto);
  }

  @Post('login')
  async login(@Body() loginUser: LoginDto): Promise<LoginRes> {
    return this.authService.login(loginUser);
  }
}
