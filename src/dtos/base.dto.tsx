import { TransformDate } from '@util/TransformDate';
import { IsOptional } from 'class-validator';
import { HiddenWhen } from '@util/decorators/HiddenWhen';

export class BaseDto {
  @TransformDate()
  @IsOptional()
  @HiddenWhen(() => true)
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  @HiddenWhen(() => true)
  createdAt?: Date;
}
