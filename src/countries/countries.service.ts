import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/restcountries.provider';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
    private readonly restCountries: RestCountriesProvider,
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
}
