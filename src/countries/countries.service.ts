import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/restcountries.provider';
import {
  TravelPlan,
  TravelPlanDocument,
} from '../travel-plans/schemas/travel-plan.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
    private readonly restCountries: RestCountriesProvider,
    @InjectModel(TravelPlan.name)
    private travelPlanModel: Model<TravelPlanDocument>,
  ) {}

  findAll() {
    return this.countryModel.find().exec();
  }

  async findByCode(code: string) {
    const upper = code.toUpperCase();

    // 1. Verificar si ya está en caché Mongo
    const country = await this.countryModel.findOne({ code: upper }).exec();
    if (country) return country;

    // 2. Usar API RestCountries si no está
    const data = await this.restCountries.getCountryByCode(upper);

    if (!data) {
      throw new NotFoundException(`Country with code ${upper} not found`);
    }

    // 3. Guardar en caché Mongo
    const created = new this.countryModel(data);
    return created.save();
  }

  async deleteByCode(code: string) {
    const upper = code.toUpperCase();

    // 1. Verificar si hay planes de viaje asociados
    const plansCount = await this.travelPlanModel
      .countDocuments({ countryCode: upper })
      .exec();

    if (plansCount > 0) {
      throw new BadRequestException(
        `No se puede borrar el país ${upper} porque tiene planes de viaje asociados`,
      );
    }

    // 2. Intentar borrar el país de la caché
    const deleted = await this.countryModel
      .findOneAndDelete({ code: upper })
      .exec();

    if (!deleted) {
      throw new NotFoundException(`Country with code ${upper} not found`);
    }

    return deleted;
  }
}
