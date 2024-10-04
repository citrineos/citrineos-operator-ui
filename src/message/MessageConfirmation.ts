import { IsBoolean, IsOptional } from 'class-validator';

export class MessageConfirmation {
  @IsBoolean()
  success!: boolean;

  @IsOptional()
  payload?: string | object;
}
