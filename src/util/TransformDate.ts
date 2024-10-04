import { Transform, Type } from 'class-transformer';
import moment from 'moment';
import dayjs from 'dayjs';
import {IsDateOrDayjs} from "./IsDateOrDayjs";

export const IS_DATE = 'isDate';

export const TransformDate = () => {
  const toPlain = Transform(
    ({ value }) => {
      if (!value && !dayjs(value).isValid() && !moment(value).isValid()) {
        console.warn('Invalid date passed to toPlain:', value);
        return value;
      }
      if (moment(value).isValid()) {
        return moment(value).toISOString();
      }
      if (dayjs(value).isValid()) {
        return dayjs(value).toISOString();
      }
      return value;
    },
    {
      toPlainOnly: true,
    },
  );

  const toClass = Transform(
    ({ value }) => {
      if (!value || !dayjs(value).isValid()) {
        console.warn('Invalid date passed to toClass:', value);
        return value;
      }
      return dayjs(value);
    },
    {
      toClassOnly: true,
    },
  );

  return function (target: any, key: string) {
    IsDateOrDayjs()(target, key);
    Type(() => Date)(target, key);
    toPlain(target, key);
    toClass(target, key);

    Reflect.defineMetadata(IS_DATE, true, target, key);
  };
};
