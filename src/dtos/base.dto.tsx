import { TransformDate } from '@util/TransformDate';
import { IsOptional } from 'class-validator';

export enum BaseDtoProps {
  updatedAt = 'updatedAt',
  createdAt = 'createdAt',
}

export class BaseDto {
  @TransformDate()
  @IsOptional()
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  createdAt?: Date;
}
