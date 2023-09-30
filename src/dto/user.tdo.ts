import {
  IsEmail,
  IsPhoneNumber,
  IsNotEmpty,
  Matches,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @Matches(/^[^$#@]*$/, { message: 'You cannot use banned characters' })
  username: string;

  @Length(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&,.\-])[A-Za-z\d@$!%*?&,.\-]*$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.(@, $, !, %, *, ?, &, ., ,) ',
    },
  )
  password: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phoneNumber: string;
}
