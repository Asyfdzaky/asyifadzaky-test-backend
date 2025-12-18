import { IsString, IsOptional, IsDateString, IsEnum } from 'class-validator';
import { TripStatus } from 'generated/prisma/client';

export class UpdateTripDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsOptional()
  destination?: any;

  @IsEnum(TripStatus)
  @IsOptional()
  status?: TripStatus;
}
