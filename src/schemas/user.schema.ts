import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  avatar: string | null;

  @Prop({ default: 1000 })
  money: number;

  // @Prop()
  // level: number

  @Prop({ default: false })
  isDeleted: boolean;

  //   @Prop()
  //   lastLoggedIn: Date;

  @Prop()
  getFreeCreditTime: Date;

  //   @Prop({ required: true, unique: true })
  //   IBAN: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
