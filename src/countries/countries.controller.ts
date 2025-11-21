import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountryCodePipe } from '../common/pipes/country-code.pipe';
import { DeleteCountryGuard } from '../common/guards/delete-country.guard';

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

  @UseGuards(DeleteCountryGuard)
  @Delete(':code')
  deleteByCode(@Param('code', CountryCodePipe) code: string) {
    return this.countriesService.deleteByCode(code);
  }
}
