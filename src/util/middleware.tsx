import dayjs from 'dayjs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '@util/Constructable';

export const getValuesFromInput = (
  input: any,
  dtoClass: Constructable<any>,
) => {
  for (const property of Object.keys(input)) {
    if (input[property] && input[property].$isDayjsObject) {
      input[property] = dayjs(input[property]).toISOString();
    }
  }
  debugger;
  return instanceToPlain(plainToInstance(dtoClass, input));
};

export const getSerializedValues = (
  input: any,
  dtoClass: Constructable<any>,
) => {
  const values = getValuesFromInput(input, dtoClass);
  const timestamp = new Date().toISOString();
  return {
    ...values,
    ...{ createdAt: timestamp },
    updatedAt: timestamp,
  } as any;
};
