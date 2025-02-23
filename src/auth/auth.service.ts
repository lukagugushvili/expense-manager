import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { RegisterRes } from './auth-responses/register-res';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginRes } from './auth-responses/login-res';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // Authenticate user and validate email
  async register(registerUserDto: CreateUserDto): Promise<RegisterRes> {
    const { email, password } = registerUserDto;
    try {
      const existingUser = await this.usersService.findFieldsForAuth(email);
      if (existingUser) {
        throw new BadRequestException(`User with ${email} already exists`);
      }

      const salt = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
      const hashedPassword = await bcrypt.hash(password, salt);

      const registerUser = await this.usersService.createUser({
        ...registerUserDto,
        password: hashedPassword,
      });

      return {
        message: 'User registered successfully',
        userId: registerUser.id,
      };
    } catch (error) {
      console.error(`Error registering user: ${error.message}`);
      throw new BadRequestException(
        `Could not register user: ${error.message}`,
      );
    }
  }

  // Sign in user with email and password
  async login(loginUser: LoginDto): Promise<LoginRes> {
    const { email, password } = loginUser;
    try {
      const emailInUse = await this.usersService.findFieldsForAuth(email);
      if (!emailInUse) throw new UnauthorizedException('Invalid credentials');

      const isPasswordValid = await bcrypt.compare(
        password,
        emailInUse.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payLoad = { sub: emailInUse.id, email, role: emailInUse.role };
      const access_token = this.jwtService.sign(payLoad);

      return { message: 'Login successful', access_token };
    } catch (error) {
      console.error(`Error login user: ${error.message}`);
      throw new UnauthorizedException(`Could not login user: ${error.message}`);
    }
  }
}
