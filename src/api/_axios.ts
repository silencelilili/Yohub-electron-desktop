import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
function jsonToFormData(config: any) {
  const formData = new FormData();
  // 循环传入的值转换formData
  Object.keys(config).forEach((key) => {
    formData.append(key, config[key]);
  });
  return formData;
}
const BASE_URL = import.meta.env.VITE_BASE_URL ?? "/api";

export class Request {
  //* axios 实例
  private instance: AxiosInstance;

  //* 基础配置
  private baseConfig: AxiosRequestConfig = {
    baseURL: BASE_URL,
    timeout: 60000,
  };

  public constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config));

    this.instance.interceptors.request.use(
      (config: any) => {
        // if (localStorage.getItem("cookie")) {
        //   config.headers["Cookie"] = localStorage.getItem("cookie");
        // }
        // console.log("请求拦截器", config);
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data } = response;
        if (response.status == 302) {
          console.log("302跳转", response.headers.location);
        }
        if (data.ret == 1) {
          return data;
        } else {
          if (data.msg) ElMessage.error(data.msg);
          return Promise.reject(data);
        }
      },
      (error: AxiosError) => {
        return Promise.reject(error.response);
      }
    );
  }

  //* 定义请求方法
  public request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.instance.request(config);
  }

  public get<T = any>(
    url: string,
    params?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.get(url, { params, ...config });
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.post(url, data, config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.instance.put(url, data, config);
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config);
  }

  public postFd<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // eslint-disable-next-line no-param-reassign
    config = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    const _data = jsonToFormData(data);
    return this.instance.post(url, _data, config);
  }
}

//* 默认导出Request实例
const Http = new Request({});
export default Http;
