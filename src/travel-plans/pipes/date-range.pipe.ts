import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { CreateTravelPlanDto } from '../dto/create-travel-plan.dto';

@Injectable()
export class DateRangePipe implements PipeTransform {
  transform(value: CreateTravelPlanDto, _metadata: ArgumentMetadata) {
    if (!value.startDate || !value.endDate) {
      throw new BadRequestException(
        'startDate and endDate are required fields',
      );
    }

    const start = new Date(value.startDate);
    const end = new Date(value.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'startDate and endDate must be valid dates',
      );
    }

    if (start > end) {
      throw new BadRequestException(
        'startDate must be before or equal to endDate',
      );
    }

    // devolvemos el mismo DTO
    return value;
  }
}
