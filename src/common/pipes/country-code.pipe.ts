import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CountryCodePipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Country code must be a string');
    }

    const trimmed = value.trim();
    const upper = trimmed.toUpperCase();

    // Debe ser exactamente 3 letras A-Z
    if (!/^[A-Z]{3}$/.test(upper)) {
      throw new BadRequestException(
        'Country code must be a 3-letter alpha-3 code',
      );
    }

    return upper;
  }
}
