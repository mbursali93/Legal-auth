import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { redis } from 'src/redis';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

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

  async login(body) {
    try {
      const { username, password } = body;
      const user = await this.userModel.findOne({ username });
      if (!user) throw new NotFoundException('yo');
      const passwordMatches = await bcrypt.compare(password, user.password);
      if (user.username !== username || !passwordMatches)
        throw new NotFoundException('Wrong username or password.');

      return user;
    } catch (err) {
      throw new NotFoundException('Wrong username or password.');
    }
  }

  async login2fa(emailCode, smsCode, userId) {
    const codes = await redis.hgetall(`codes:userId:${userId}`);
    if (emailCode !== codes.emailCode || smsCode !== codes.smsCode)
      throw new BadRequestException('Do not match');

    const promises = await Promise.all([
      this.userModel.findOne({ _id: userId }),
      redis.del(`codes:userId:${userId}`),
      this.jwtService.sign({ userId }),
    ]);

    const [user, redisStatus, userToken] = promises;

    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return { user: userWithoutPassword, userToken };
  }

  generate2FaCode() {
    const codeDigit = 6;

    let code = '';
    for (let i = 0; i < codeDigit; i++) {
      const random = Math.floor(Math.random() * 10);
      code += random.toString();
    }

    return code;
  }
}
