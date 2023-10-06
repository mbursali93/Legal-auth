import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/user.tdo';
import { Login2FaDto } from 'src/dto/login2fa.dto';
import { redis } from 'src/redis';
import { AwsS3Service } from 'src/aws/aws_s3/aws_s3.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uploadService: AwsS3Service,
  ) {}

  @Post('register')
  async register(@Body() body: RegisterDto, @UploadedFile() file) {
    try {
      let avatar: string | null = null;
      if (file) avatar = await this.uploadService.upload(file, Date.now());
      return await this.authService.register(body, avatar);
    } catch (err) {
      console.log(err);
    }
  }

  @Post('login')
  async login(@Body() body) {
    try {
      const user = await this.authService.login(body);
      // const { email, phoneNumber } = user;

      // TODO: send email and sms
      const emailCode = this.authService.generate2FaCode();
      const smsCode = this.authService.generate2FaCode();

      redis.hset(`codes:userId:${user._id}`, 'emailCode', emailCode);
      redis.hset(`codes:userId:${user._id}`, 'smsCode', smsCode);
      redis.expire(`codes:userId:${user._id}`, 300);

      return { emailCode, smsCode };
    } catch (err) {
      return err.response;
    }
  }

  // LOGIN 2FA
  @Post('login2Fa')
  async login2Factor(@Body() body: Login2FaDto) {
    const { emailCode, smsCode, userId } = body;
    return await this.authService.login2fa(emailCode, smsCode, userId);
  }

  //LOGOUT
}
