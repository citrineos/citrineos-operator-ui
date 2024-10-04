import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Constructable } from './Constructable';
import { UnsuccessfulRequestException } from '../exceptions/UnsuccessfulRequestException';

const CITRINE_CORE_URL = import.meta.env.VITE_CITRINE_CORE_URL;

export class MissingRequiredParamException extends Error {
  override name = 'MissingRequiredParamException' as const;

  constructor(
    public field: string,
    msg?: string,
  ) {
    super(msg);
  }
}

// TODO can we use typed-rest-client here else axios in CORE?
export class BaseRestClient {
  private axiosInstance!: AxiosInstance;
  private _baseUrl = `${CITRINE_CORE_URL}/ocpp/`;

  constructor() {
    this.initAxiosInstance();
  }

  get baseUrl(): string {
    return this._baseUrl;
  }

  set baseUrl(value: string) {
    this._baseUrl = value;
    this.initAxiosInstance();
  }

  async optionsRaw<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.options<T>(url, config!);
  }

  async options<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
  ): Promise<T> {
    return this.optionsRaw<T>(path, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  async getRaw<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config!);
  }

  async get<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
  ): Promise<T> {
    return this.getRaw<T>(path, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  async delRaw<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, config!);
  }

  async del<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
  ): Promise<T> {
    return this.delRaw<T>(path, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  async postRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, body, config!);
  }

  async post<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    return this.postRaw<T>(path, body, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  async patchRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.patch<T>(url, body, config!);
  }

  async patch<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    return this.patchRaw<T>(path, body, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  async putRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, body, config!);
  }

  async put<T>(
    path: string,
    clazz: Constructable<T>,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    return this.putRaw<T>(path, body, config).then((response) =>
      this.handleResponse(clazz, response),
    );
  }

  protected handleResponse<T>(
    clazz: Constructable<T>,
    response: AxiosResponse<T>,
  ): T {
    if (response.status >= 200 && response.status <= 299) {
      return response.data as T;
    } else {
      throw new UnsuccessfulRequestException(
        'Request did not return a successful status code',
        response,
      );
    }
  }

  private initAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
