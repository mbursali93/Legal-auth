import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { AwsS3Service } from './aws/aws_s3/aws_s3.service';
import { AwsS3Module } from './aws/aws_s3/aws_s3.module';
import { MainService } from './utils/main.service';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 3000,
        limit: 3,
      },
    ]),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName: process.env.MONGO_DBNAME,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
      //  readPreference: 'secondaryPreferred',
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    AwsS3Module,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService, AwsS3Service, MainService],
})
export class AppModule {}
