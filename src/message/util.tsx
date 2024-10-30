import { BaseRestClient } from '../util/BaseRestClient';
import { Constructable } from '../util/Constructable';
import { notification } from 'antd';
import { Expose } from 'class-transformer';

export const showSucces = () => {
  notification.success({
    message: 'Success',
    description: 'The request was successful.',
    placement: 'topRight',
  });
};

export const showError = (msg: string) => {
  notification.error({
    message: 'Request Failed',
    description: msg,
    placement: 'topRight',
  });
};

export interface TriggerMessageAndHandleResponseProps<T> {
  url: string;
  responseClass: Constructable<T>;
  data: any;
  responseSuccessCheck: (response: T) => boolean;
  isDataUrl?: boolean;
  setLoading?: (loading: boolean) => void;
}

export const triggerMessageAndHandleResponse = async <T,>({
  url,
  responseClass,
  data,
  responseSuccessCheck,
  isDataUrl = false,
  setLoading,
}: TriggerMessageAndHandleResponseProps<T>) => {
  try {
    if (setLoading) {
      setLoading(true);
    }
    const client = new BaseRestClient(isDataUrl);
    const response = await client.post(url, responseClass, {}, data);

    // todo reuse handle response!
    if (responseSuccessCheck(response)) {
      showSucces();
    } else {
      let msg = 'The request did not receive a successful response.';
      if ((response as any).payload) {
        // todo incorrect response type?
        msg += `Response payload: ${(response as any).payload}`;
      }
      showError(msg);
    }
  } catch (error: any) {
    showError('The request failed with message: ' + error.message);
  } finally {
    if (setLoading) {
      setLoading(false);
    }
  }
};

export const readFileContent = (file: File | null): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return resolve('');
    }

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };
    fileReader.onerror = (error) => reject(error);

    fileReader.readAsText(file);
  });
};

export const hasOwnProperty = (obj: any, key: string) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

export const createClassWithoutProperty = <T,>(
  cls: new () => T,
  excludedKey: keyof T,
): new () => Omit<T, typeof excludedKey> => {
  // Create a new class that extends the original class
  const newClass = class extends (cls as any) {
    constructor() {
      super();
      // Remove the property from the instance itself
      delete (this as any)[excludedKey];
    }
  };

  // Ensure the property is also excluded when serialized using class-transformer
  Expose({ toPlainOnly: true })(newClass.prototype, excludedKey as string);

  return newClass as new () => Omit<T, typeof excludedKey>;
};
