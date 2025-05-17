import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import {
  ApiResponse,
  ApiSuccessResponse,
  type ApiErrorResponse,
} from "../types/apiResponse";

export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError & { data: ApiErrorResponse } => {
  return (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as any).data === "object" &&
    error.data !== null &&
    "message" in (error as any).data
  );
};

export const isApiSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success;
};
