import { Module } from '@nestjs/common';
import { JwtService } from 'src/utils/jwt.service';

@Module({
  providers: [JwtService],
  exports: [JwtService],
})
export class AuthModule {}
