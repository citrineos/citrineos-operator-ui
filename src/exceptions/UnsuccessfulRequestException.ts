import { AxiosResponse } from 'axios';

export class UnsuccessfulRequestException extends Error {
  iRestResponse?: AxiosResponse<any>;

  constructor(message: string, iRestResponse?: AxiosResponse<any>) {
    super(message);
    this.name = 'UnsuccessfulRequestException';
    this.iRestResponse = iRestResponse;
  }
}
