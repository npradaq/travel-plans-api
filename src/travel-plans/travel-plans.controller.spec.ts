import { Test, TestingModule } from '@nestjs/testing';
import { TravelPlansController } from './travel-plans.controller';
import { TravelPlansService } from './travel-plans.service';

describe('TravelPlansController', () => {
  let controller: TravelPlansController;

  const travelPlansServiceMock = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TravelPlansController],
      providers: [
        {
          provide: TravelPlansService,
          useValue: travelPlansServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TravelPlansController>(TravelPlansController);

    // limpiar mocks
    travelPlansServiceMock.create.mockReset();
    travelPlansServiceMock.findAll.mockReset();
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  it('POST /travel-plans debería delegar en TravelPlansService.create', async () => {
    const dto = {
      countryCode: 'COL',
      title: 'Viaje a Bogotá',
      startDate: '2025-02-02',
      endDate: '2025-02-10',
      notes: 'Visitar Monserrate',
    };

    const saved = { _id: '123', ...dto };

    travelPlansServiceMock.create.mockResolvedValue(saved);

    const result = await controller.create(dto);

    expect(travelPlansServiceMock.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(saved);
  });

  it('GET /travel-plans debería delegar en TravelPlansService.findAll', async () => {
    const plans = [{ title: 'Viaje 1' }];

    travelPlansServiceMock.findAll.mockResolvedValue(plans);

    const result = await controller.findAll();

    expect(travelPlansServiceMock.findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(plans);
  });
});
