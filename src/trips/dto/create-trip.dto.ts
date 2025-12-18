import { IsString, IsNotEmpty, IsJSON, IsDateString } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  touristId: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsNotEmpty()
  destination: any; // InputJsonValue
}
