import { IsString, IsInt, IsOptional, IsEnum } from 'class-validator';
import { Gender } from 'generated/prisma/client';

export class UpdateTouristDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsInt()
  @IsOptional()
  age?: number;

  @IsString()
  @IsOptional()
  address?: string;
}
