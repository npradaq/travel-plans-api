import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CountryDocument = Country & Document;

@Schema({ timestamps: true })
export class Country {
  @Prop({ required: true, unique: true })
  code: string; // alpha-3: "COL", "FRA"

  @Prop({ required: true })
  name: string;

  @Prop()
  region: string;

  @Prop()
  subregion: string;

  @Prop()
  capital: string;

  @Prop()
  population: number;

  @Prop()
  flagUrl: string;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
