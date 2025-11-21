import { Controller, Get, Param } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryCodePipe } from '../common/pipes/country-code.pipe';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  findAll() {
    return this.countriesService.findAll();
  }

  @Get(':code')
  findByCode(@Param('code', CountryCodePipe) code: string) {
    return this.countriesService.findByCode(code);
  }
}
