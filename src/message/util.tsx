import { HttpMethod } from '@citrineos/base';
import { BaseRestClient } from '../util/BaseRestClient';
import { Constructable } from '../util/Constructable';
import { notification } from 'antd';
import { Expose } from 'class-transformer';

export const showSucces = (payload?: string) => {
  notification.success({
    message: 'Success',
    description: 'The request was successful' + payload ? ': ' + payload : '.',
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
  method?: HttpMethod;
  setLoading?: (loading: boolean) => void;
}

export const triggerMessageAndHandleResponse = async <T,>({
  url,
  responseClass,
  data,
  responseSuccessCheck,
  isDataUrl = false,
  method = HttpMethod.Post,
  setLoading,
}: TriggerMessageAndHandleResponseProps<T>) => {
  try {
    if (setLoading) {
      setLoading(true);
    }
    const client = new BaseRestClient(isDataUrl);
    let response = undefined;
    switch (method) {
      case HttpMethod.Post:
        response = await client.post(url, responseClass, {}, data);
        break;
      case HttpMethod.Delete:
        response = await client.del(url, responseClass, {});
        break;
      default:
        throw new Error(`Unimplemented Http Method: ${method}`);
    }

    // todo reuse handle response!
    if (responseSuccessCheck(response)) {
      showSucces((response as any).payload);
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

/*
 * Returns null if not pem format
 */
export function formatPem(pem: string): string | null {
  // Define PEM header and footer
  const header = '-----BEGIN CERTIFICATE-----';
  const footer = '-----END CERTIFICATE-----';

  // Trim whitespace from the entire string
  const trimmedPem = pem.trim();

  // Check if the string contains valid header and footer
  if (!trimmedPem.startsWith(header) || !trimmedPem.endsWith(footer)) {
    return null; // Invalid PEM format
  }

  // Extract content between the header and footer
  const base64Content = trimmedPem
    .slice(header.length, trimmedPem.length - footer.length)
    .replace(/\s+/g, '');

  // Validate the base64 content length
  if (
    base64Content.length % 4 !== 0 ||
    !/^[A-Za-z0-9+/]*={0,2}$/.test(base64Content)
  ) {
    return null; // Not a valid base64 string
  }

  // Split the content into 64-character lines
  const formattedContent = base64Content.match(/.{1,64}/g)?.join('\n');

  // Reassemble the PEM with correct newlines
  const formattedPem = `${header}\n${formattedContent}\n${footer}`;

  return formattedPem;
}
