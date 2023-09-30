import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async register(body) {
    const { username, email, password, phoneNumber } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });
  }
}
