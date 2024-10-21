import { BaseRestClient } from '../util/BaseRestClient';
import { Constructable } from '../util/Constructable';
import { notification } from 'antd';

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

export const triggerMessageAndHandleResponse = async <T,>(
  url: string,
  responseClass: Constructable<T>,
  data: any,
  responseSuccessCheck: (response: T) => boolean,
) => {
  try {
    const client = new BaseRestClient();
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
