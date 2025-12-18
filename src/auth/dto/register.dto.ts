import { IsEmail, IsString, IsInt, MinLength } from 'class-validator';
import { Gender } from 'generated/prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  name: string;

  @IsString()
  phone: string;

  gender: Gender;

  @IsInt()
  age: number;

  @IsString()
  address: string;
}
