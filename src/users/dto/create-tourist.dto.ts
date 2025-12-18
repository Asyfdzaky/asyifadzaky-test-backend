import { IsEmail, IsString, IsInt } from 'class-validator';
import { Gender } from 'generated/prisma/client';

export class CreateTouristDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  gender: Gender;

  @IsInt()
  age: number;

  @IsString()
  address: string;
}
