// SPDX-FileCopyrightText: 2025 Contributors to the CitrineOS Project
//
// SPDX-License-Identifier: Apache-2.0

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { UnsuccessfulRequestException } from '../exceptions/UnsuccessfulRequestException';
import { incrementRequestCount } from '../telemetry';
import { OCPPVersion } from '@citrineos/base';
import { authProvider } from '@util/auth';
import config from './config';

const CITRINE_CORE_URL = config.citrineCoreUrl;

export class MissingRequiredParamException extends Error {
  override name = 'MissingRequiredParamException' as const;

  constructor(
    public field: string,
    msg?: string,
  ) {
    super(msg);
  }
}

export class BaseRestClient {
  private axiosInstance!: AxiosInstance;
  private _baseUrl: string;

  constructor(ocppVersion: OCPPVersion | null = OCPPVersion.OCPP2_0_1) {
    if (ocppVersion === null) {
      this._baseUrl = `${CITRINE_CORE_URL}/data/`;
    } else if (ocppVersion === OCPPVersion.OCPP1_6) {
      this._baseUrl = `${CITRINE_CORE_URL}/ocpp/1.6`;
    } else {
      this._baseUrl = `${CITRINE_CORE_URL}/ocpp/2.0.1/`;
    }
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

  async options<T>(path: string, config: AxiosRequestConfig): Promise<T> {
    return this.optionsRaw<T>(path, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  async getRaw<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    incrementRequestCount({ url: url });
    return this.axiosInstance.get<T>(url, config!);
  }

  async get<T>(path: string, config: AxiosRequestConfig): Promise<T> {
    incrementRequestCount({ path: path });
    return this.getRaw<T>(path, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  async delRaw<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    incrementRequestCount({ url: url });
    return this.axiosInstance.delete<T>(url, config!);
  }

  async del<T>(path: string, config: AxiosRequestConfig): Promise<T> {
    incrementRequestCount({ path: path });
    return this.delRaw<T>(path, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  async postRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    incrementRequestCount({ url: url });
    return this.axiosInstance.post<T>(url, body, config!);
  }

  async post<T>(
    path: string,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    incrementRequestCount({ path: path });
    return this.postRaw<T>(path, body, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  async patchRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    incrementRequestCount({ url: url });
    return this.axiosInstance.patch<T>(url, body, config!);
  }

  async patch<T>(
    path: string,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    incrementRequestCount({ path: path });
    return this.patchRaw<T>(path, body, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  async putRaw<T>(
    url: string,
    body: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    incrementRequestCount({ url: url });
    return this.axiosInstance.put<T>(url, body, config!);
  }

  async put<T>(
    path: string,
    config: AxiosRequestConfig,
    body: any,
  ): Promise<T> {
    incrementRequestCount({ path: path });
    return this.putRaw<T>(path, body, config).then((response) =>
      this.handleResponse<T>(response),
    );
  }

  protected handleResponse<T>(response: AxiosResponse<T>): T {
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
    this.axiosInstance.interceptors.request.use(async (config) => {
      // Get token and add to headers if it exists
      const token = await authProvider.getToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }
}
