import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface RestCountryApi {
  cca3: string;
  name: { common: string };
  region: string;
  subregion: string;
  capital?: string[];
  population: number;
  flags?: { png?: string };
}

@Injectable()
export class RestCountriesProvider {
  private readonly baseUrl = 'https://restcountries.com/v3.1';

  constructor(private readonly httpService: HttpService) {}

  async getCountryByCode(code: string) {
    const url = `${this.baseUrl}/alpha/${code}`;

    try {
      const response = await firstValueFrom(
        this.httpService.get<RestCountryApi[]>(url),
      );

      const data = response.data;

      if (!Array.isArray(data) || data.length === 0) {
        return null;
      }

      const c = data[0];

      return {
        code: c.cca3,
        name: c.name?.common ?? '',
        region: c.region ?? '',
        subregion: c.subregion ?? '',
        capital: c.capital && c.capital.length > 0 ? c.capital[0] : '',
        population: c.population ?? 0,
        flagUrl: c.flags?.png ?? '',
      };
    } catch (error: unknown) {
      console.error(
        `[RestCountriesProvider] Error fetching country ${code}:`,
        error instanceof Error ? error.message : error,
      );

      return null;
    }
  }
}
