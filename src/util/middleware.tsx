import dayjs from 'dayjs';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Constructable } from '@util/Constructable';
import moment from 'moment';
import { defaultMetadataStorage } from '@util/DefaultMetadataStorage';
import 'reflect-metadata';

const convertTimestampsToPlain = (obj: any, dtoClass?: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item: any) => convertTimestampsToPlain(item, dtoClass));
  }

  if (typeof obj === 'object' && obj !== null) {
    const metadataMap = new Map<string, string>();

    if (dtoClass) {
      const metadata = defaultMetadataStorage.getExposedMetadatas(dtoClass);
      metadata.forEach((meta: any) => {
        if (meta.options?.name) {
          metadataMap.set(meta.options.name, meta.options.name);
          metadataMap.set(meta.propertyName, meta.options.name);
        }
      });
    }
    return Object.keys(obj).reduce((acc, key) => {
      const transformedKey = metadataMap.get(key) || key; // Map plain key to DTO key if @Expose() is used

      const value = obj[key];
      if (value?.$isDayjsObject) {
        acc[transformedKey] = dayjs(value).toISOString();
      } else if (value?._isAMomentObject) {
        acc[transformedKey] = moment(value).toISOString();
      } else {
        acc[transformedKey] = convertTimestampsToPlain(value, dtoClass); // Recursively process nested objects
      }

      return acc;
    }, {} as any);
  }

  return obj;
};

export const getValuesFromInput = (
  input: any,
  dtoClass: Constructable<any>,
) => {
  return instanceToPlain(
    plainToInstance(dtoClass, convertTimestampsToPlain(input, dtoClass)),
  );
};

export const getSerializedValues = (
  input: any,
  dtoClass: Constructable<any>,
) => {
  const values = getValuesFromInput(input, dtoClass);
  const timestamp = new Date().toISOString();
  return {
    ...values,
    ...(values.createdAt ? {} : { createdAt: timestamp }),
    updatedAt: timestamp,
  } as any;
};
