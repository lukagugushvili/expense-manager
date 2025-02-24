import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      process.env.MONGO_URL ?? 'mongodb://localhost:27017',
    ),
    UsersModule,
    ExpensesModule,
    AuthModule,
  ],
})
export class AppModule {}
