import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';
import { getModelToken } from '@nestjs/mongoose';
import { Country } from './schemas/country.schema';
import { RestCountriesProvider } from './providers/restcountries.provider';
import { NotFoundException } from '@nestjs/common';

// Tipos para los mocks
type JestFn = jest.Mock;

type CountryModelType = {
  new (...args: any[]): { save: JestFn };
  find: JestFn;
  findOne: JestFn;
};

describe('CountriesService', () => {
  let service: CountriesService;

  // Mocks de métodos
  const findMock: JestFn = jest.fn();
  const findOneMock: JestFn = jest.fn();
  const saveMock: JestFn = jest.fn();

  // "Modelo" de Mongoose mockeado (constructor + métodos estáticos)
  const countryModelMock: CountryModelType = Object.assign(
    jest.fn(() => ({
      save: saveMock,
    })),
    {
      find: findMock,
      findOne: findOneMock,
    },
  );

  const restCountriesProviderMock = {
    getCountryByCode: jest.fn() as JestFn,
  };

  beforeEach(async () => {
    // limpiar mocks antes de cada prueba
    findMock.mockReset();
    findOneMock.mockReset();
    saveMock.mockReset();
    restCountriesProviderMock.getCountryByCode.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getModelToken(Country.name),
          useValue: countryModelMock,
        },
        {
          provide: RestCountriesProvider,
          useValue: restCountriesProviderMock,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  describe('findAll', () => {
    it('debería retornar todos los países desde la base de datos', async () => {
      const countries = [
        { code: 'COL', name: 'Colombia' },
        { code: 'FRA', name: 'France' },
      ];

      findMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(countries),
      });

      const result = await service.findAll();

      expect(findMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(countries);
    });
  });

  describe('findByCode', () => {
    it('debería retornar el país desde la base si ya existe (caché)', async () => {
      const countryFromDb = { code: 'COL', name: 'Colombia' };

      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(countryFromDb),
      });

      const result = await service.findByCode('col'); // probamos el toUpperCase

      expect(findOneMock).toHaveBeenCalledWith({ code: 'COL' });
      expect(restCountriesProviderMock.getCountryByCode).not.toHaveBeenCalled();
      expect(saveMock).not.toHaveBeenCalled();
      expect(result).toEqual(countryFromDb);
    });

    it('debería consultar RestCountries y guardar si no está en base', async () => {
      // 1. BD no lo tiene
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // 2. RestCountries lo devuelve
      const apiCountry = {
        code: 'COL',
        name: 'Colombia',
        region: 'Americas',
        subregion: 'South America',
        capital: 'Bogotá',
        population: 50000000,
        flagUrl: 'https://flagcdn.com/co.png',
      };

      restCountriesProviderMock.getCountryByCode.mockResolvedValue(apiCountry);

      // 3. save() guarda y devuelve el país creado
      const savedCountry = { _id: '123', ...apiCountry };
      saveMock.mockResolvedValue(savedCountry);

      const result = await service.findByCode('COL');

      expect(findOneMock).toHaveBeenCalledWith({ code: 'COL' });
      expect(restCountriesProviderMock.getCountryByCode).toHaveBeenCalledWith(
        'COL',
      );
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedCountry);
    });

    it('debería lanzar NotFoundException si no está en base ni en RestCountries', async () => {
      // BD no lo tiene
      findOneMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      // RestCountries tampoco
      restCountriesProviderMock.getCountryByCode.mockResolvedValue(null);

      await expect(service.findByCode('XXX')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
