import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Mật khẩu ít nhất 6 ký tự' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty()
  usernameOrEmail: string;

  @MinLength(6, { message: 'Mật khẩu ít nhất 6 ký tự' })
  password: string;
}