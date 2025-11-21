import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TravelPlansService } from './travel-plans.service';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { DateRangePipe } from './pipes/date-range.pipe';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('travel-plans')
export class TravelPlansController {
  constructor(private readonly travelPlansService: TravelPlansService) {}

  @Post()
  create(@Body(DateRangePipe) dto: CreateTravelPlanDto) {
    return this.travelPlansService.create(dto);
  }

  @Get()
  findAll() {
    return this.travelPlansService.findAll();
  }
}
