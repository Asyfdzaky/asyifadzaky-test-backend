import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateCredentialsDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;
}
