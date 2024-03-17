import axios, { AxiosRequestConfig, Method } from 'axios';

import { authStore } from '../../stores';

abstract class BaseApiService {
  private readonly basePath: string;

  private readonly host = process.env.REACT_APP_HOST || window.location.origin;

  protected constructor(basePath: string) {
    this.basePath = basePath;
  }

  protected GET<T>(path = '', options?: AxiosRequestConfig): Promise<T> {
    return this.safeFetch(`${this.basePath}?${path}`, 'get', null, options);
  }

  protected GETBYID<T>(path = '', options?: AxiosRequestConfig): Promise<T> {
    return this.safeFetch(`${this.basePath}/${path}`, 'get', null, options);
  }

  protected POST<T>(path = '', data?: any, options?: AxiosRequestConfig): Promise<T> {
    const reqPath = path ? `${this.basePath}/${path}` : this.basePath;

    return this.safeFetch(reqPath, 'post', data, options);
  }

  protected PUT<T>(path = '', data?: any, options?: AxiosRequestConfig): Promise<T> {
    return this.safeFetch(`${this.basePath}/${path}`, 'put', data, options);
  }

  protected DELETE<T>(path = '', data?: any, options?: AxiosRequestConfig): Promise<T> {
    return this.safeFetch(`${this.basePath}/${path}`, 'delete', data, options);
  }

  /**
   * Base Request
   */
  public async safeFetch(
    path: string,
    method: Method,
    data?: any,
    options: AxiosRequestConfig = {},
  ): Promise<any> {
    if (!options.headers?.['Content-Type'])
      options.headers = {
        'Content-Type': 'application/json',
      };

    const authTokens = localStorage.getItem('authTokens');

    if (authTokens)
      options.headers.Authorization = 'Bearer ' + String(JSON.parse(authTokens).access);

    const baseURL = this.host;
    const url = `${path}`;

    try {
      const response = await axios.request({
        baseURL,
        url,
        method,
        data,
        ...options,
      });

      return response.data ? response.data : response;
    } catch (errorData: any) {
      console.log(errorData);

      if (errorData.response.status === 401) authStore.clearUserInfo();
      throw errorData;
    }
  }
}

export default BaseApiService;
