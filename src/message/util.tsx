import { BaseRestClient } from '../util/BaseRestClient';
import { TriggerMessageResponse } from './trigger-message';
import { Constructable } from '../util/Constructable';
import { notification } from 'antd';

export const generateRandomLong = () => {
  const maxInt = Number.MAX_SAFE_INTEGER; // 2^53 - 1
  const minInt = 0;
  return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
};

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
    const response = await client.post(url, TriggerMessageResponse, {}, data);

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
