import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TravelPlan, TravelPlanDocument } from './schemas/travel-plan.schema';
import { CreateTravelPlanDto } from './dto/create-travel-plan.dto';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class TravelPlansService {
  constructor(
    @InjectModel(TravelPlan.name)
    private readonly travelPlanModel: Model<TravelPlanDocument>,
    private readonly countriesService: CountriesService,
  ) {}

  async create(dto: CreateTravelPlanDto) {
    // Validar país usando CountriesService (esto también se encarga del caché)
    await this.countriesService.findByCode(dto.countryCode);

    const plan = new this.travelPlanModel({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
    });

    return plan.save();
  }

  findAll() {
    return this.travelPlanModel.find().exec();
  }
}
