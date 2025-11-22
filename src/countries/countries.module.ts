import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { Country, CountrySchema } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/restcountries.provider';
import { DeleteCountryGuard } from '../common/guards/delete-country.guard';
import {
  TravelPlan,
  TravelPlanSchema,
} from '../travel-plans/schemas/travel-plan.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Country.name, schema: CountrySchema },
      { name: TravelPlan.name, schema: TravelPlanSchema }, // <- nuevo
    ]),
  ],
  controllers: [CountriesController],
  providers: [CountriesService, RestCountriesProvider, DeleteCountryGuard],
  exports: [CountriesService],
})
export class CountriesModule {}
