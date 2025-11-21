import { Test, TestingModule } from '@nestjs/testing';
import { TravelPlansService } from './travel-plans.service';
import { CountriesService } from '../countries/countries.service';
import { getModelToken } from '@nestjs/mongoose';
import { TravelPlan } from './schemas/travel-plan.schema';
import { NotFoundException } from '@nestjs/common';

type JestFn = jest.Mock;

type TravelPlanModelType = {
  new (...args: any[]): { save: JestFn };
  find: JestFn;
};

describe('TravelPlansService', () => {
  let service: TravelPlansService;

  // mocks del modelo de Mongoose
  const findMock: JestFn = jest.fn();
  const saveMock: JestFn = jest.fn();

  const travelPlanModelMock: TravelPlanModelType = Object.assign(
    jest.fn(() => ({
      save: saveMock,
    })),
    {
      find: findMock,
    },
  );

  // mock de CountriesService
  const countriesServiceMock = {
    findByCode: jest.fn() as JestFn,
  };

  beforeEach(async () => {
    findMock.mockReset();
    saveMock.mockReset();
    countriesServiceMock.findByCode.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelPlansService,
        {
          provide: CountriesService,
          useValue: countriesServiceMock,
        },
        {
          provide: getModelToken(TravelPlan.name),
          useValue: travelPlanModelMock,
        },
      ],
    }).compile();

    service = module.get<TravelPlansService>(TravelPlansService);
  });

  describe('create', () => {
    it('debería crear un plan de viaje si el país existe', async () => {
      // CountriesService devuelve un país válido
      countriesServiceMock.findByCode.mockResolvedValue({
        code: 'COL',
        name: 'Colombia',
      });

      const dto = {
        countryCode: 'COL',
        title: 'Viaje a Bogotá',
        startDate: '2025-02-02',
        endDate: '2025-02-10',
        notes: 'Visitar Monserrate',
      };

      const savedPlan = {
        _id: '123',
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
      };

      saveMock.mockResolvedValue(savedPlan);

      const result = await service.create(dto);

      expect(countriesServiceMock.findByCode).toHaveBeenCalledWith('COL');
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedPlan);
    });

    it('debería lanzar NotFoundException si el país no existe', async () => {
      countriesServiceMock.findByCode.mockRejectedValue(
        new NotFoundException('Country not found'),
      );

      const dto = {
        countryCode: 'XXX',
        title: 'Viaje a ningún lugar',
        startDate: '2025-02-02',
        endDate: '2025-02-10',
      };

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('debería retornar todos los planes', async () => {
      const plans = [{ title: 'Viaje 1' }, { title: 'Viaje 2' }];

      findMock.mockReturnValue({
        exec: jest.fn().mockResolvedValue(plans),
      });

      const result = await service.findAll();

      expect(findMock).toHaveBeenCalledTimes(1);
      expect(result).toEqual(plans);
    });
  });
});
