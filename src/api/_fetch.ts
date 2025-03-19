// src/utils/fetch.ts

import { ElMessage } from "element-plus";
import log from '@/utils/logger'

const BASE_URL = `${import.meta.env.VITE_BASE_DOMAIN}`;

type ResponseData<T> = {
  ret: number;
  data: T;
  msg: string;
  [x: string]: any;
};
async function fetchApi<T>(
  url: string,
  options?: any
): Promise<ResponseData<T>> {
  try {
    let _opt = {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body ? JSON.stringify(options.body) : undefined,
    };
    if (options?.formData) {
      _opt.body = options.body;
    }
    const response = await fetch(BASE_URL + url, {
      ..._opt,
    });
    if (!response.ok) {
      const error = new Error(`Fetch error! status: ${response.status}`);
      throw error;
    }
    const data: ResponseData<T> = await response.json();
    if (data.ret !== 1) {
      if (data?.msg) ElMessage.error(data?.msg);
      log.error('[API Error]', data)
      log.error(`[Renderer] url: ${url} -->`, data)

      throw new Error(`Response code error! Ret: ${data.ret}`);
    }
    return data;
  } catch (error) {
    log.error(`[Renderer] url: ${ url} -->`, error)
    console.error("Fetch failed:", error);
    throw error;
  }
}

async function get<T>(url: string, params?: any): Promise<ResponseData<T>> {
  return fetchApi<T>(url, { method: "GET", body: params });
}

async function post<T>(
  url: string,
  data: any,
  options?: any
): Promise<ResponseData<T>> {
  return fetchApi<T>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: data,
    ...options,
  });
}

export default {
  get,
  post,
};
