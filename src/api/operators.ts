import axios, { type AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import type { ApiErrorResponse } from "./types";

const extractMessage = (payload: ApiErrorResponse | undefined) => {
  if (!payload) return "Something went wrong. Please try again.";

  if (payload.message) return payload.message;

  if (payload.errors) {
    const firstKey = Object.keys(payload.errors)[0];
    const value = payload.errors[firstKey];
    if (Array.isArray(value)) return value[0] ?? "Validation failed.";
    if (typeof value === "string") return value;
  }

  return "Request failed. Please try again.";
};

export const apiRequest = async <T>(config: AxiosRequestConfig): Promise<T> => {
  try {
    const response = await apiClient.request<T>(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
      const message = extractMessage(error.response?.data);
      throw new Error(message);
    }

    throw new Error("Unexpected network error. Please try again.");
  }
};
