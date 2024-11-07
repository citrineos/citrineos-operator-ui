import { TransformDate } from './TransformDate';
import { IsOptional } from 'class-validator';
import { HiddenWhen } from './decorators/HiddenWhen';

export class BaseModel {
  @TransformDate()
  @IsOptional()
  @HiddenWhen(() => true)
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  @HiddenWhen(() => true)
  createdAt?: Date;
}
