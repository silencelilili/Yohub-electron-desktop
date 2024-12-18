interface RequestConfig {
  url: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  body?: any;
}
type RequestInterceptor = (
  config: RequestConfig
) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;
const BASE_URL = `${import.meta.env.VITE_BASE_DOMAIN}`;
class FetchWrapper {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  // 添加请求拦截器的方法
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  // 添加响应拦截器的方法
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }

  // 发送请求的核心方法
  async request(config: RequestConfig): Promise<any> {
    // 依次执行请求拦截器
    let currentConfig = config;
    for (const interceptor of this.requestInterceptors) {
      currentConfig = await interceptor(currentConfig);
    }

    try {
      const response = await fetch(`${BASE_URL}${currentConfig.url}`, {
        method: currentConfig.method || "GET",
        headers: currentConfig.headers || {},
        body: currentConfig.body
          ? JSON.stringify(currentConfig.body)
          : undefined,
      });

      // 依次执行响应拦截器
      let currentResponse = response;
      for (const interceptor of this.responseInterceptors) {
        currentResponse = await interceptor(currentResponse);
      }

      // 解析响应数据，这里简单假设响应是JSON格式，可根据实际情况调整
      return currentResponse.json();
    } catch (error) {
      console.error("请求出错:", error);
      throw error;
    }
  }

  //* 定义请求方法
  // public request<T = any>(config: AxiosRequestConfig): Promise<T> {
  //   return this.instance.request(config);
  // }

  public get<T = any>(url: string, params?: any): Promise<T> {
    return this.request({ url, method: "GET", body: params });
  }
  public post<T = any>(url: string, params?: any): Promise<T> {
    return this.request({ url, method: "POST", body: params });
  }
}

// 创建实例
const fetchWrapper = new FetchWrapper();

// 添加请求拦截器，例如添加公共的授权头
fetchWrapper.addRequestInterceptor((config) => {
  // const token = localStorage.getItem("token");
  // if (token) {
  config.headers = {
    ...config.headers,
    "Content-Type": "application/json",
    // Authorization: `Bearer ${token}`,
  };
  // }
  return config;
});

// 添加响应拦截器，例如统一处理401错误（未授权）
fetchWrapper.addResponseInterceptor((response) => {
  if (response.status === 401) {
    // 这里可以做一些如跳转到登录页面等处理逻辑
    console.log("未授权，可能需要重新登录");
  }
  // try {
  //   console.log("未授权，可能需要重新登录");
  //   const _res: any = response.json();
  //   if (_res?.ret === 1) {
  //     return _res;
  //   } else {
  //     return new Error(_res);
  //   }
  // } catch (error) {
  //   return response;
  // }
  return response;
});
const post = <T = any>(url: string, params?: any): Promise<T> => {
  return fetchWrapper.request({ url, method: "POST", body: params });
};
const get = <T = any>(url: string, params?: any): Promise<T> => {
  return fetchWrapper.request({ url, method: "GET", body: params });
};

export default {
  post,
  get,
};
