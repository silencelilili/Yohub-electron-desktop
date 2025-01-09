// src/utils/fetch.ts

import { ElMessage } from "element-plus";

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
    const response = await fetch(BASE_URL + url, {
      method: options.method || "GET",
      headers: options.headers || {},
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
      const error = new Error(`Fetch error! status: ${response.status}`);
      throw error;
    }
    const data: ResponseData<T> = await response.json();
    if (data.ret !== 1) {
      if (data?.msg) ElMessage.error(data?.msg);
      throw new Error(`Response code error! Ret: ${data.ret}`);
    }
    return data;
  } catch (error) {
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
