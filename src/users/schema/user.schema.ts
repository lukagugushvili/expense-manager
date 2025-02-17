import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRoles } from 'src/enums/user-roles';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  userName: string;

  @Prop([{ type: Types.ObjectId, ref: 'Expense' }])
  expense: Types.ObjectId[];

  @Prop({ default: UserRoles.USER, enum: UserRoles })
  role: UserRoles;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
