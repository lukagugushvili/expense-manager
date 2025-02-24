import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
