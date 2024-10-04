import { TransformDate } from './TransformDate';
import { IsOptional } from 'class-validator';
import { Hidden } from './decorators/Hidden';

export class BaseModel {
  @TransformDate()
  @IsOptional()
  @Hidden()
  updatedAt?: Date;

  @TransformDate()
  @IsOptional()
  @Hidden()
  createdAt?: Date;
}
