import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateTravelPlanDto {
  @IsString()
  countryCode: string;

  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
