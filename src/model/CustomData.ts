import { IsString, MinLength } from 'class-validator';
import { UnknownPropertiesType } from '@util/unknowns';

export class CustomDataType {
  @IsString()
  @MinLength(1)
  vendorId!: string;

  @UnknownPropertiesType
  unknownProperties!: unknown[];
}
