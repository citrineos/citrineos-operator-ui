// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import { HttpMethod, OCPPVersion } from '@citrineos/base';
import { BaseRestClient } from '@lib/utils/BaseRestClient';
import { MessageConfirmation } from '@lib/utils/MessageConfirmation';
import { closeModal } from '@lib/utils/store/modal.slice';
import store from '@lib/utils/store/store';
import { Expose } from 'class-transformer';
import { toast } from 'sonner';

export const showSuccess = (payload?: string | object) => {
  const payloadString = payload ? JSON.stringify(payload) : '.';
  toast.success('Success', {
    description: `The request was successful ${payloadString}`,
  });
};

export const showError = (msg: string) => {
  toast.error('Request Failed', {
    description: msg,
  });
};

export interface TriggerMessageAndHandleResponseProps<T> {
  url: string;
  data: any;
  ocppVersion?: OCPPVersion | null;
  method?: HttpMethod;
  setLoading?: (loading: boolean) => void;
  responseSuccessCheck?: (response: T) => boolean;
}

type MessageConfirmationOrArray = MessageConfirmation | MessageConfirmation[];

export const triggerMessageAndHandleResponse = async <
  T extends MessageConfirmationOrArray,
>({
  url,
  data,
  ocppVersion = OCPPVersion.OCPP2_0_1,
  method = HttpMethod.Post,
  setLoading,
  responseSuccessCheck,
}: TriggerMessageAndHandleResponseProps<T>) => {
  try {
    setLoading?.(true);

    const client = new BaseRestClient(ocppVersion);
    let response = undefined;
    switch (method) {
      case HttpMethod.Post:
        response = await client.postRaw<T>(url, data);
        break;
      case HttpMethod.Delete:
        response = await client.delRaw<T>(url);
        break;
      default:
        throw new Error(`Unimplemented Http Method: ${method}`);
    }

    if (!response.data && response.status === 200) {
      store.dispatch(closeModal());
      showSuccess();
      return;
    }
    if (responseSuccessCheck && responseSuccessCheck(response.data)) {
      store.dispatch(closeModal());
      showSuccess();
    } else if (ocppResponseSuccessCheck(response.data)) {
      store.dispatch(closeModal());
      const payload = Array.isArray(response.data)
        ? response.data.length > 0 && response.data[0].payload
          ? response.data[0].payload
          : undefined
        : response.data.payload;

      showSuccess(payload);
    } else {
      let msg = 'The request did not receive a successful response.';
      if (response instanceof MessageConfirmation || Array.isArray(response)) {
        msg += ` ${generateErrorMessageFromResponses(response)}`;
      }
      showError(msg);
    }
  } catch (error: any) {
    showError('The request failed with message: ' + error.message);
  } finally {
    setLoading?.(false);
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
  return `${header}\n${formattedContent}\n${footer}`;
}

export const ocppResponseSuccessCheck = (
  response: MessageConfirmationOrArray,
) => {
  if (Array.isArray(response)) {
    return response.every((r) => r && r.success);
  }
  return response && response.success;
};

export const generateErrorMessageFromResponses = (
  response: MessageConfirmationOrArray,
) => {
  let msg = '';
  if (Array.isArray(response)) {
    if (response.length === 1) {
      response.map((r, i) => {
        if (!r.success) {
          msg += `Request ${i} failed. `;
          if ((r as any).payload) {
            msg += `${(r as any).payload}. `;
          }
        }
      });
      return msg;
    } else {
      response = response[0];
    }
  }
  if ((response as any).payload) {
    msg += `Response payload: ${(response as any).payload}`;
  }
  return msg;
};
