import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from 'src/dto/user.tdo';
import { Login2FaDto } from 'src/dto/login2fa.dto';
import { redis } from 'src/redis';
import { AwsS3Service } from 'src/aws/aws_s3/aws_s3.service';
import { MainService } from 'src/utils/main.service';
import { AuthGuard } from './auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly uploadService: AwsS3Service,
    private readonly mainService: MainService,
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

  @UseGuards(ThrottlerGuard) // improve
  @Post('login')
  async login(@Body() body) {
    try {
      const user = await this.authService.login(body);
      const { email, phoneNumber } = user;

      const emailCode = this.authService.generate2FaCode();
      const smsCode = this.authService.generate2FaCode();

      redis.hset(`codes:userId:${user._id}`, 'emailCode', emailCode);
      redis.hset(`codes:userId:${user._id}`, 'smsCode', smsCode);
      redis.expire(`codes:userId:${user._id}`, 300);

      // this.mainService.sendSms(phoneNumber, smsCode);
      // this.mainService.sendMail(email, emailCode);

      console.log({ emailCode, smsCode });
      return {
        message: 'Sms and Mail sent',
        error: null,
        statusCode: 201,
      };
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

  @UseGuards(AuthGuard)
  @Delete('logout')
  async logout(@Request() req) {
    const userId = req['user'].userId;
    return await this.authService.logout(userId);
  }

  //DELETE USER

  @UseGuards(AuthGuard)
  @Delete()
  async deleteUser(@Request() req) {
    const userId = req['user'].userId;
    return await this.authService.deleteUser(userId);
  }
}
