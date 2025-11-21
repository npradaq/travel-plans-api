import { Test, TestingModule } from '@nestjs/testing';
import { CountriesController } from './countries.controller';
import { CountriesService } from './countries.service';

describe('CountriesController', () => {
  let controller: CountriesController;

  const countriesServiceMock = {
    findAll: jest.fn(),
    findByCode: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CountriesController],
      providers: [
        {
          provide: CountriesService,
          useValue: countriesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<CountriesController>(CountriesController);

    countriesServiceMock.findAll.mockReset();
    countriesServiceMock.findByCode.mockReset();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('GET /countries debería delegar en CountriesService.findAll', async () => {
    const mockCountries = [{ code: 'COL', name: 'Colombia' }];
    countriesServiceMock.findAll.mockResolvedValue(mockCountries);

    const result = await controller.findAll();

    expect(countriesServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockCountries);
  });

  it('GET /countries/:code debería delegar en CountriesService.findByCode', async () => {
    const mockCountry = { code: 'COL', name: 'Colombia' };
    countriesServiceMock.findByCode.mockResolvedValue(mockCountry);

    const result = await controller.findByCode('COL');

    expect(countriesServiceMock.findByCode).toHaveBeenCalledWith('COL');
    expect(result).toEqual(mockCountry);
  });
});
