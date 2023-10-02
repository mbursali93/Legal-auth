import { IsString, Length, IsMongoId } from 'class-validator';

export class Login2FaDto {
  @IsString()
  @Length(6)
  emailCode: string;

  @IsString()
  @Length(6)
  smsCode: string;

  @IsMongoId()
  userId: string;
}
